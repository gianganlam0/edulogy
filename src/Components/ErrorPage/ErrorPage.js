import { useParams } from 'react-router-dom';
import './ErrorPage.scss';

export default function ErrorPage({msg}) {
    const params = useParams();
    document.title = "Lỗi !";
    if (msg === undefined) {
        msg = "Không tìm thấy trang " + params.urlmsg + "! =(((";
    }
    return (
        <div className='error-page'>
            <div className="overlay" />

            <section className="section-error">
                <div className="container">
                    <div className="boxed">
                        <div className="section-title text-center">
                            <h3>{msg}</h3>
                        </div>

                        <div className="error-top">
                            <div className="left-text">
                                <p></p>
                            </div>
                        </div>

                        <hr className="invis"></hr>

                    </div>
                    
                </div>
            </section>
        </div>
    );
}