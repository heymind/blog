import { MdSearch } from "react-icons/md";
import { PostItem } from './PostItem';
import { useState } from 'react';

function searchFilter(posts, searchText) {
    const keywords = searchText.toLowerCase().split(" ");
    return posts.map(post => {
        let weight = 0;
        for (const keyword of keywords) {
            if (keyword.startsWith("#")) {
                if (post.tags) {
                    for (const tag of post.tags) {
                        if (!(tag.toLowerCase().indexOf(keyword.slice(1)) < 0)) {
                            weight += 100;
                        }
                    }

                }
            } else {
                if (post.title && !(post.title.toLowerCase().indexOf(keyword) < 0)) {
                    weight += 1;
                }
            }

        }
        return { weight, ...post }
    }).filter(post=>post.weight>0).sort((a, b) => b.weight - a.weight);

}


export const Posts = ({ simple, posts,search="" }) => {
    const [searchText, setSearchText] = useState(search);
    return (
        <div>
            <div className="SubHeader">
                <h2>文章</h2>
                <div className="flex-grow" />
                {simple ? (<a href="/posts" className="extra flex items-center hover:bg-purple-100 rounded cursor-pointer">
                    <MdSearch className="mx-2 " />
                    <span className="px-2 border-l border-purple-400  ">更多</span>
                </a>) : (<div className="extra flex items-center relative ">
                    <MdSearch className="mx-2 bg-purple-100 absolute" />
                    <input className="bg-purple-100 pl-8 py-1 rounded tracking-wider"
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}></input>
                </div>)}

            </div>
            {searchFilter(posts,searchText).map(post => (
                <PostItem key={post.slug} {...post} />
            ))}
        </div>
    );
} 
