import { Header } from "../Header"
import { MDContainer } from '../MDContainer'
import {TopBar} from '../TopBar'
import Head from 'next/head';
export const Layout = ({ frontMatter,children }) => (<div>
     <Head>
        <title>{frontMatter.title}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.16.0/themes/prism-tomorrow.css"/>
      </Head>
      
    <Header />
    <TopBar />
    <div className="flex flex-wrap items-center justify-center">
        <div className="w-full md:w-3/4 xl:w-3/5 p-3 " style={{marginTop:"-6.75rem"}}>
            <MDContainer>{children}</MDContainer>
        </div>
    </div>


</div>)