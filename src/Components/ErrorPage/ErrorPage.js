import './ErrorPage.scss';

export default function ErrorPage({msg}) {
    document.title = "Lỗi !";
    if (msg === undefined) {
        msg = "Không tìm thấy trang này =(((";
    }
    return (
        <div className='error-page'>
            <div className="overlay" />

            <section className="section-error">
                <div className="container">
                    <div class="boxed">
                        <div className="section-title text-center">
                            <h3>{msg}</h3>
                        </div>

                        <div class="error-top">
                            <div class="left-text">
                                <p></p>
                            </div>
                        </div>

                        <hr class="invis"></hr>

                    </div>
                    
                </div>
            </section>
        </div>
    );
}