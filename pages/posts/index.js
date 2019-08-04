import { Posts } from "../../components/Posts";
import { Header } from "../../components/Header";
import { withRouter } from 'next/router';
import {TopBar} from "../../components/TopBar";

const PostList = props => (
    <div>

<TopBar />
      <Header />
      <div className="flex flex-wrap items-center justify-center">
        <div className="w-full md:w-3/4 xl:w-1/2 p-3">
          <Posts simple={false} posts={props.posts} search={props.router.query.search || ""} />
        </div>
      </div>
    </div>
  );
  
  PostList.getInitialProps = async () => {
    if (!process.browser) {
      const Posts = await require("../../meta/posts");
  
      return { posts: Posts };
    }
  };
  export default withRouter(PostList);