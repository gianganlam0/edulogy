
import $ from 'jquery';
import LOADER_GIF from '../../images/loader.gif';

export default function Home() {
    return <>
        <div id="preloader">
            <img className="preloader" src={LOADER_GIF} alt="aaa" />
        </div>
    </>
}