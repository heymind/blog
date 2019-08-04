---
title: 流量收集 (PF_RING + gopacket)
category:
  - coding
tags:
  - PF_RING
  - go
  - gopacket
---

# 流量收集
## Table of Contents
## 背景与需求
由于科研需要收集匿名HTTP流量用作 Cache & Prefetch 相关的研究，于是我们在校园网出口部署了一台流量镜像服务器。该服务器可以监听到该处口所有的原始流量数据，大约  10GB/s 虽然校园网出口大于 10GBps 但由于莫名的原因只能镜像到这么多的需求了。
但即便如此，从些原始流**量中**过滤出 HTTP 流量并把 HTTP 头部信息存储下来都是一个很大的挑战。
刚开始研究相关技术、设计系统方案的时候，先去评估了 nDPI 深度包检测工具，介绍的功能十分强大，能识别广范围的协议，还能对加密的流量做一些分析，心动不已。但随后翻约了其文档，文档的繁复程度印证了这的确是一套强大的系统，但并不适合我们。
- 我们仅需要其中很小的一部分功能，甚至不需要还原TCP Flow 就能实现需求 ( 记录 HTTP Headers 信息 )
- 并没有水平写出安全的、高吞吐量的 C++ 代码 ( 还是菜😭 )
- 时间不是很充裕，既没有时间仔细研究 nDPI 又没有时间仔细研究 C++

### gopacket
之后发现了 [goacket](https://godoc.org/github.com/google/gopacket)，在谷歌爸爸名下听着就靠谱， go 语言也又好了很多 ( 其实后面还不少踩坑 )。不过感觉显然操作系统内核原生提供的 TCP/IP 协议栈并不是为这种巨大型流量监听设计的，使用系统的混杂模式去监听会频繁的在内核和用户态之间拷贝数据降低性能。

#### gopacket + PF_RING

> PF_RING : PF_RING™ is polling packets from NICs by means of Linux NAPI. This means that NAPI copies packets from the NIC to the PF_RING™ circular buffer, and then the userland application reads packets from ring. In this scenario, there are two pollers, both the application and NAPI and this results in CPU cycles used for this polling; the advantage is that PF_RING™ can distribute incoming packets to multiple rings (hence multiple applications) simultaneously.

##### gopacket + PF_RING2

PF_RING 能解决上述问题，直接从网卡获取数据，不去和操作系统内核的协议栈打交道。并且 gopacket 自带了对 PF_RING 的支持。

###### gopacket + PF_RING2
fgfgfd

## 环境准备
### 安装 PF_RING
#### 在虚拟机中安装 PF_RING
PF_RING 并不是随便某个网卡就支持，因此我们需要修改虚拟机虚拟的网卡型号，比如设置成这一款。
![](https://i.loli.net/2019/05/26/5cea493c6e9d434649.jpg)

具体安装方法与所使用的操作系统有关，这里给出了相关参考连接。
- https://www.ntop.org/guides/pf_ring/get_started/packages_installation.html
- http://packages.ntop.org/

![](https://i.loli.net/2019/05/26/5cea493e38fb423747.jpg)
使用内置的 pf_count 测试一下内核模块是否成功安装，程序是否能正常运行。
#### 在服务器中安装 PF_RING
其实跟在虚拟机里面一样，但首先需要确认好 NIC 是否被 PF_RING 支持。这里有个支持网卡厂商与支持功能的列表。

- https://www.ntop.org/guides/pf_ring/modules/index.html

![](https://i.loli.net/2019/05/26/5cea4956c808f66885.jpg)

流量的确挺大的。

## 初步尝试 
### 首先定义一下我们想收集到的数据的结构
```go
type HTTPInfo struct {
	IPVersion int
	SrcIP     string
	DstIP     string
	SrcPort   int
	DstPort   int
	
	Pragma      string
	Connection  string
	ContentType string
	Flow        string
	// 存储其他的头部信息
	Extras      map[string]interface{}
	// time
	Time time.Time
}
type HTTPResponseInfo struct {
	HTTPInfo
	StatusCode      int
	Server          string
	ContentEncoding string
	CacheControl    string
}
type HTTPRequestInfo struct {
	HTTPInfo
	Method                  string
	Host                    string
	URI                     string
	UserAgent               string
	UserAgentOSName         string
	UserAgentOSVersion      string
	UserAgentDeviceType     string
	UserAgentBrowserName    string
	UserAgentBrowserVersion string
	Referer                 string
}
```
### 初始化并使用 gopacket + PF_RING
gopacket 的接口做的简单易懂，直接看文档配合给的 example 就可以简单的写出了一个可用的收集程序。
**初始化并使用**
```go
var err error
var ring *pfring.Ring
if ring, err = pfring.NewRing(*argIface, snaplen, pfring.FlagPromisc); err != nil {
	log.Fatalln("pfring ring creation error", *argIface, err)
}
if err := ring.SetBPFFilter(*argBPFFilter); err != nil {
	log.Fatalln("BPF filter error:", err)
}
if err := ring.SetSocketMode(pfring.ReadOnly); err != nil {
	log.Fatalln("pfring SetSocketMode error:", err)
}
if err := ring.Enable(); err != nil {
	log.Fatalln("pfring Enable error:", err)
}

source := gopacket.NewPacketSource(ring, layers.LayerTypeEthernet)

source.Lazy = true
source.NoCopy = true
source.DecodeStreamsAsDatagrams = true
for packet := range source.Packets() {
		// do something with packet
}
```
**过滤包**
虽然 HTTP 是由 TCP 承载的， gopacket 也提供 ip 包还原 TCP Flow 的支持，但我们不用！😂😂 我们只需要 HTTP 的头，其他的不关心。处理方法：
- 判断是不是 TCP 包
- 如果是TCP包，TCP Payload 部分是不是以 HTTP GET POST PUT ... 开头的
- 如果是，此包 含 HTTP 包头，记录下来

以太网链路层数据帧的 MTU 是 1500 ，即便存在各种层的封装，HTTP 头的信息一个包就能放得下，这样收集更加简单高效。
```go
var eth layers.Ethernet
var ip4 layers.IPv4
var ip6 layers.IPv6
var tcp layers.TCP
var payload gopacket.Payload
parser := gopacket.NewDecodingLayerParser(layers.LayerTypeEthernet, &eth, &ip4, &ip6, &tcp, &payload)
decoded := []gopacket.LayerType{}
for packet := range source.Packets() {
		if err := parser.DecodeLayers(packet.Data(), &decoded); err != nil {
			continue
		}
		for _, layerType := range decoded {

			switch layerType {
			case layers.LayerTypeIPv6:
				IPVersion = 6

			case layers.LayerTypeIPv4:
				IPVersion = 4

			case gopacket.LayerTypePayload:
				isRequest, isResponse = ExtractHTTPInfo(payload.Payload(), &req, &res)}
				
	... 省略 ...
``` 
以上代码可以把 TCP 的 Payload 取出来

**ExtractHTTPInfo**
```go
func ExtractHTTPInfo(payload []byte, req *HTTPRequestInfo, res *HTTPResponseInfo) (bool, bool) {
	var err error
	if bytes.HasPrefix(payload, []byte("HTTP")) {
	   // 这是一个 Response 报
	} else if bytes.HasPrefix(payload, []byte("GET")) ||
		bytes.HasPrefix(payload, []byte("POST")) ||
		bytes.HasPrefix(payload, []byte("PUT")) ||
		bytes.HasPrefix(payload, []byte("DELETE")) ||
		bytes.HasPrefix(payload, []byte("PATCH")) ||
		bytes.HasPrefix(payload, []byte("HEAD")) {
		// 这是一个 Request 报
		
		}
```
似乎这个样子就能用了，我们抽象出来一个 `PacketConsumer` 用来多线程并行处理.
```go
func PacketConsumer(source chan Packet) {
	for packet := range source {
	   ...
   }
}
   
...
ring := SetupNewRing(v)  
source:=gopacket.NewPacketSource(ring,layers.LayerTypeEthernet)
for i := 0; i < *argNThread; i++ {
		go PacketConsumer(source.Packets())
}
```
结果包全都丢了......
![](https://i.loli.net/2019/05/26/5cea493d3f50478538.jpg)

分一下🔥图，看起来 ( 红色部分 ) 主要在干两件事情，GC 和 调度，而黄色部分才是过滤包占用的CPU时间 ( 有点惨😭 ) 。如果 GC 过于频繁的话不难猜出是由于大量、频繁创建生命周期短的对象造成的，于是乎就萌生了使用对象池的念想。 ( 并发环境中对象池的损耗更大些，这样做性能反而降低了许多😂 )
![](https://i.loli.net/2019/05/26/5cea493ff06da34889.jpg)


## 一改再改
具体如何增加对象池 ( 使用的是 go 运行库内置的，关于这个 Pool 网上对于其的争议也不少 ) 的支持就不在这里展开了，结果就是下图的样子， 频繁 GC 问题得到解决，但更多的时间浪费在锁上面了。
![](https://i.loli.net/2019/05/26/5cea493d0fbd959251.jpg)

## 最终方案
睡了一觉起来再分析这个问题，主要矛盾集中在单核满载过滤流量处理不过来，利用多核支持，想利用多核支持就要涉及到多线程、线程同步的问题，线程同步处理不当性能不升反降。
- 能不能不用锁？
  不管是什么同步方法，策略的元信息的存取还是得靠锁来把控，即便是使用 chan + select 内部还是一个队列加一个轻量级的锁，通过第一张🔥图中 `runtime.lock` 看出来其实还是有锁。
  `一改再改`中使用了对象池，对象池元信息管理的时候，相当于使用了一个重量级锁，性能不升反降。
  
如果用 PF_RING 还真能不使用锁利用多核。再次在 PF_RING 的介绍中看到了它可以帮助了我们把包分发到多个 Ring 上，那么我们为每一个 Ring 配备一个 PacketConsumer，这样 `PacketConsumer` 之间 Shared Nothing，就能高效处理了。
> the advantage is that PF_RING™ can distribute incoming packets to multiple rings (hence multiple applications) simultaneously.
  
  
  自然 PF_RING 内部有更加健壮、稳定、高吞吐量的方案来实现包的分发。利用 PF_RING 的 cluster 特性可以实现。
  
  
```go
func SetupNewRing(clusterNumber int) *pfring.Ring {
 ...
	if err = ring.SetCluster(clusterNumber, pfring.ClusterRoundRobin); err != nil {
		log.Fatalln("pfring SetCluster error:", err, clusterNumber)
	}
  
```

```go
for i := 0; i < *argNThread; i++ {
		v := i + 1
		go func() {
			runtime.LockOSThread()
			ring := SetupNewRing(v)
			time.Sleep(time.Second * 3)
			go PacketConsumerNG(ring, v)
		}()
	}

```
最终版的火焰图😋😋，大部分的CPU时间是在做『正事』。
![Snipaste_2019-04-19_08-57-37](https://i.loli.net/2019/05/26/5cea493b5e4e786596.png)
  
而且也不丢包了。
![](https://i.loli.net/2019/05/26/5cea493f9a53f91717.jpg)


## 数据存储
收集下来的数据需要一种存储策略，直接丢到硬盘上是不合理的，如果直接存储再硬盘上难以二次检索和利用，数据处理相当于做全表扫码且数据量过于巨大。

### ElasticSearch
(待续)

### kafka + ?

import { Layout } from '../../components/layouts/Article'

export default Layout