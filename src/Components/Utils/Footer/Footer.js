import React from 'react';
import {
    MDBFooter,
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBIcon
} from 'mdb-react-ui-kit';
import * as Icon from 'react-bootstrap-icons';
import './Footer.scss';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function Footer() {
    const handleCopyEmail = () => {
        var email = document.getElementById("myEmail");

        navigator.clipboard.writeText(email.textContent);

        // Alert the copied text
        Swal.fire({
            position: 'top',
            text: 'Đã copy',
            icon: 'success',
            showConfirmButton: true,
            timer: 1500,
            width: 200,
        })
    }
    return <>
        <footer id="footer">

            <MDBFooter className='text-center' color='white' bgColor='dark'>
                <MDBContainer className='p-4'>
                    <section className='mb-4'>
                        <Button variant="primary" style={{ backgroundColor: '#3b5998' }} onClick={() => { window.location.href = 'https://www.fb.com/anlam.bku' }}>
                            <Icon.Facebook />
                        </Button>
                        <Button variant="danger" style={{ backgroundColor: '#ac2bac' }} onClick={() => { window.location.href = 'https://www.instagram.com/anlamcurser' }}>
                            <Icon.Instagram />
                        </Button>
                        <Button variant="secondary" style={{ backgroundColor: '#333333' }} onClick={() => { window.location.href = 'https://github.com/gianganlam0' }}>
                            <Icon.Github />
                        </Button>
                    </section>

                    <hr />

                    <section className=''>
                        <MDBContainer className='text-center text-md-start mt-5'>
                            <MDBRow className='mt-3'>
                                <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
                                    <h6 className='text-uppercase fw-bold mb-4'>
                                        <Icon.Building className='me-3' />
                                        EDULOGY
                                    </h6>
                                    <p>
                                        Viết viết cái gì đó ở đây
                                    </p>
                                </MDBCol>

                                <MDBCol md="5" lg="4" xl="4" className='mx-auto mb-4'>
                                    <h6 className='text-uppercase fw-bold mb-4'>
                                        <Icon.MapFill className='me-3' />
                                        Bản đồ</h6>
                                    {/* embeded a google map */}
                                    <div className='mapouter'>
                                        <div className='gmap_canvas'>
                                        <iframe title='map' src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4659.41417593841!2d106.80346139003528!3d10.881164001254735!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xd577177b5198597f!2sHo%20Chi%20Minh%20City%20University%20of%20Technology%20-%20Vietnam%20National%20University%20Ho%20Chi%20Minh%20City%20(Campus%202)!5e0!3m2!1sen!2s!4v1663065982742!5m2!1sen!2s" width="100%" height="100%" allowFullScreen loading="lazy"/>
                                        </div>
                                    </div>
                                </MDBCol>


                                <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
                                    <h6 className='text-uppercase fw-bold mb-4'>
                                        <Icon.TelephoneFill className='me-3' />
                                        Địa chỉ</h6>
                                    <p>
                                        <MDBIcon icon="home" className="me-3" />Ký túc xá khu B...
                                    </p>
                                    <p id='myEmail'>
                                        <MDBIcon icon="envelope" className="me-3" />vios.tee97@gmail.com<span><Button variant='dark' id='copyBtn' onClick={handleCopyEmail}><Icon.ClipboardFill /></Button></span>
                                    </p>
                                    <p>
                                        <MDBIcon icon="phone" className="me-3" />+84905560751
                                    </p>
                                </MDBCol>
                            </MDBRow>
                        </MDBContainer>
                    </section>
                </MDBContainer>
            </MDBFooter>
        </footer>
    </>
}