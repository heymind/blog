import "../styles/index.css";
import { Posts } from "../components/Posts";
import { Header } from "../components/Header";
import { useState } from "react";
import Head from 'next/head';
// const SubHeader = ({ title }) => (
//   <div>

//   </div>
// );
const MeInfo = ({}) => {
  const [noWeibo, setNoWeibo] = useState(false);
  const [clickedWeChat, setClickedWeChat] = useState(false);
  return (
    <div
      className="flex flex-col border border-purple-500 m-3  items-center justify-around"
      style={{ height: "24rem", minWidth: "16rem" }}
    >
      <div
        className="w-32 h-32 border border-purple-500 rounded-full text-center pt-20 text-purple-700"
        style={{ fontSize: "0.6rem" }}
      >
        抱歉，这里没有头像
      </div>
      <div className="text-sm font-light">
        <div>
          天津人 在北京<del>明光村</del>
          <b>北邮</b>上大学
        </div>
        <div className="text-center">学计算机👨‍🦲</div>
      </div>
      <div className="text-sm w-full">
        <a
          className="flex m-1 py-1 px-4 items-center hover:bg-purple-100"
          href="https://github.com/heymind"
        >
          <img
            className="w-6 h-6 mr-2"
            src="https://img.icons8.com/nolan/64/000000/github.png"
          />
          Github
        </a>
        <div
          className="flex m-1 py-1 px-4 items-center hover:bg-purple-100 cursor-pointer"
          onClick={() => {
            setNoWeibo(true);
            setTimeout(() => setNoWeibo(false), 3000);
          }}
        >
          <img
            className="w-6 h-6 mr-2"
            src="https://img.icons8.com/color/48/000000/weibo.png"
          />
          {noWeibo ? <b>已经不发微博了😅😅</b> : "Weibo"}
        </div>
        <div
          className="flex m-1 py-1 px-4 items-center hover:bg-purple-100 cursor-pointer"
          onClick={() => setClickedWeChat(true)}
        >
          <img
            className="w-6 h-6 mr-2"
            src="https://img.icons8.com/color/48/000000/weixing.png"
          />
          WeChat
        </div>
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            backgroundColor: "rgba(255,255,255,0.8)",
            display: clickedWeChat ? "flex" : "none"
          }}
        >
          <div className="w-64 h-64 border border-purple-700 bg-white p-4 flex flex-col items-center justify-around">
            <p>微信账号似乎不能随意公开吧</p>
            <p>但可以留下您的联系方式哦</p>
            <input className="border border-purple-700" />
            <span className="bg-purple-700 p-1 w-24 text-white text-center cursor-pointer"  onClick={() => alert("十分抱歉，这个功能还没有写")}>
              OK
            </span>
            <span
              className="bg-purple-700 p-1 w-24 text-white text-center cursor-pointer"
              onClick={() => setClickedWeChat(false)}
            >
              Cancel
            </span>
          </div>
        </div>
      </div>
      <div className="text-center text-sm font-light">
        啥都喜欢😍，啥都不会😅
      </div>
    </div>
  );
};
const InterestingPart = ()=>{
  return (            <div
    className="flex items-center justify-center border m-3 border-purple-500"
    style={{ height: "24rem", minWidth: "16rem" }}
  >
    <h2 className="w-full text-purple-500 text-center text-4xl">?</h2>
  </div>)
}
const Index = props => (
  <div>
    <Header />
    <Head>
        <title>IDX0</title>
      </Head>
    <div className="flex flex-wrap items-center justify-center">
      <div className="w-full md:w-3/4 xl:w-1/2 p-3">
        <Posts simple={true} posts={props.posts} />
        {/* <div>
          <div className="SubHeader">
            <h2>专题</h2>
          </div>
          <div className="flex flex-wrap items-center justify-around">
            <a className="w-full md:w-1/3 py-1 px-2 m-2 hover:bg-purple-100 rounded tracking-wider">
              Ardui与
            </a>
            <a className="w-full md:w-1/3 py-1 px-2 m-2">Ardui与</a>
            <a className="w-full md:w-1/3 py-1 px-2 m-2">Ardui与</a>
            <a className="w-full md:w-1/3 py-1 px-2 m-2">Ardui与</a>
          </div>
        </div> */}
        <div>
          <div className="SubHeader">
            <h2>关于我</h2>
          </div>
          <div className="flex flex-row overflow-y-scroll scrolling-touch">
            <MeInfo />
            <div
              className="flex flex-col border m-3 border-orange-500"
              style={{ height: "24rem", minWidth: "16rem" }}
            >
              <h2 className="w-full border-b p-3 font-light text-orange-500 border-orange-500">
                玩物
              </h2>
              <div>
                <div className="flex m-1 py-1 px-4 items-center hover:bg-orange-100">
                  <img
                    className="w-6 h-6 mr-2"
                    src="https://img.icons8.com/color/48/000000/3d-printer.png"
                  />

                  <div>
                    <span className="text-sm">3D 打印机</span>
                    <p className="text-sm font-light">造东西用的</p>
                  </div>
                </div>
                <div className="flex m-1 py-1 px-4 items-center hover:bg-orange-100">
                  <img
                    className="w-6 h-6 mr-2"
                    src="https://img.icons8.com/ios/50/000000/macbook.png"
                  />
                  <div>
                  <span className="text-sm">MacBook</span>
                  <p className="text-sm font-light">搬砖用的</p>
                  </div>
                </div>
                <div className="flex m-1 py-1 px-4 items-center hover:bg-orange-100">
                  <img
                    className="w-6 h-6 mr-2"
                    src="https://img.icons8.com/cute-clipart/64/000000/cell-phone.png"
                  />
                  <div>
                  <span className="text-sm">Nokia Phone</span>
                  <p className="text-sm font-light">这年头还有人用诺基亚呢</p>
                  </div>
                </div>
                <div className="flex m-1 py-1 px-4 items-center hover:bg-orange-100">
                  <img
                    className="w-6 h-6 mr-2"
                    src="https://img.icons8.com/color/48/000000/arduino.png"
                  />
                  <div>
                  <span className="text-sm">Raspberry Pi & Arduino</span>
                  <p className="text-sm font-light">好东西...好东西...</p>
                  </div>
                </div>
                <div className="flex m-1 py-1 px-4 items-center hover:bg-orange-100">
                  <img
                    className="w-6 h-6 mr-2"
                    src="https://img.icons8.com/wired/64/000000/keyboard.png"
                  />
                  <div>
                  <span className="text-sm">Niz Plum</span>
                  <p className="text-sm font-light">国产静电容 舒服死我了</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="flex flex-col border m-3 border-teal-500"
              style={{ height: "24rem", minWidth: "16rem" }}
            >
              <h2 className="w-full border-b p-3 font-light text-teal-500 border-teal-500">
                技术债
              </h2>
              <div className="flex items-center justify-center text-sm text-teal-500 h-full">
                先欠着
              </div>
            </div>
            <div
              className="flex flex-col border m-3 border-blue-500"
              style={{ height: "24rem", minWidth: "16rem" }}
            >
              <h2 className="w-full border-b p-3 font-light text-blue-500 border-blue-500">
                博客程序写完了吗？
              </h2>
              <div>
              <span className="flex m-1 py-1 px-4 items-center hover:bg-purple-100 cursor-pointer">👌  主页 & 搜索</span>
              <span className="flex m-1 py-1 px-4 items-center hover:bg-purple-100 cursor-pointer">👌  文章页 & TOC</span>
              <span className="flex m-1 py-1 px-4 items-center hover:bg-purple-100 cursor-pointer">👌  关于我</span>
              <span className="flex m-1 py-1 px-4 items-center hover:bg-purple-100 cursor-pointer">🍌  迁移老博客 <p className="text-sm font-light ml-2">重新整理</p></span>
              <span className="flex m-1 py-1 px-4 items-center hover:bg-purple-100 cursor-pointer">😅  RSS <p className="text-sm font-light ml-2">马上就好</p></span>
              <span className="flex m-1 py-1 px-4 items-center hover:bg-purple-100 cursor-pointer">😅  评论 <p className="text-sm font-light ml-2">正在写后台</p></span>
              <span className="flex m-1 py-1 px-4 items-center hover:bg-purple-100 cursor-pointer">😅  图库 <p className="text-sm font-light ml-2">照片还没拍</p></span>
              </div>
            </div>
          <InterestingPart />
          </div>
        </div>
        <div>
          <div className="SubHeader">
            <h2>友情链接</h2>
           
          </div>
          <div>还没找呢</div>
        </div>
      </div>
    </div>
  </div>
);

Index.getInitialProps = async () => {
  if (!process.browser) {
    const Posts = await require("./../meta/posts");

    return { posts: Posts };
  }
};
export default Index;
