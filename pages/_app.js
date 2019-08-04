import React from "react";
import App, { Container } from "next/app";
import "../styles/global.css";
const appId='xxxxxxx-xxxx'
const appKey='xxxxxxxxx'
class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Valine
          appId={appId}
          appKey={appKey}
          pagesize={12}
          customTxt={{
            tips: { sofa: "抢个沙发吧~" },
            ctrl: { more: "再给我来一打" }
          }}
        >
          <Component {...pageProps} />
        </Valine>
      </Container>
    );
  }
}

export default App;
