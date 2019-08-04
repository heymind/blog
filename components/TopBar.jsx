import './TopBar.css'
import { MdHome } from 'react-icons/md'
import {FaAngleDoubleUp} from 'react-icons/fa'
import React from 'react'

export class TopBar extends React.Component {
    state = { position: 'absolute' }
    componentDidMount() {
        window.addEventListener('scroll', this.bindScroll.bind(this))
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.bindScroll);
    }
    bindScroll(event) {
        const position = window.pageYOffset < 200 ? 'absolute' :'fixed';
        if(position != this.state.position) this.setState({position})
    }
    render() {
        return (<div 
                className="TopBar flex w-full p-2 shadow top-0 fixed md:absolute md:top-auto md:shadow-none bg-white md:bg-transparent" 
                style={{ 
                    position:this.state.position,
                    top:this.state.position == 'fixed' ? '0' : null
                     }}>
            <div className="nav">
                <a className="route" href="/">
                    <MdHome className="icon" />
                    <span>主页</span>
                </a>
            </div>
            <div className="flex-grow"></div>
            <div className="actions flex items-center py-1 px-2 rounded cursor-pointer hover:text-purple-700" >
                <FaAngleDoubleUp onClick={()=>window.scrollTo(0,0)}/>
            </div>
        </div>)
    }
}