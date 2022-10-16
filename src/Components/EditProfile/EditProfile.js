import './EditProfile.scss';
import { Button } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

export default function EditProfile() {
    document.title = "Thay đổi thông tin cá nhân";
    return (
        <div className='edit-profile'>
            <div className="overlay" />
            <section className="section-profile">
                <div className="container">
                    <div class="boxed">

                        <div className="section-title text-center">
                            <h3>Thay đổi thông tin cá nhân</h3>
                        </div>

                        <div class="row">
                            <div class="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                                <div class="card h-100">
                                    <div class="card-body">
                                        <div class="account-settings">
                                            <div class="user-profile">
                                                <div class="user-avatar">
                                                    <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="Nguyễn Hữu Bảo" />
                                                </div>
                                                {/* <input type="file" />Chọn ảnh đại diện                                               <h5 class="user-name">Nguyễn Hữu Bảo</h5> */}
                                                <h6 class="user-email">vios.tee97@gmail.com</h6>
                                            </div>
                                            <div class="about">
                                                <h5>Giới thiệu</h5>
                                                <p>I'm Bảo. Full Stack Designer. I enjoy creating user-centric, delightful and human experiences.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                                <div class="card h-100">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                <h6 class="mb-2 text-primary">Thông tin cá nhân</h6>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div class="form-group">
                                                    <label for="pre-name">Họ và tên đệm</label>
                                                    <input type="text" class="form-control" id="pre-name" placeholder="Họ và tên đệm" />
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div class="form-group">
                                                    <label for="name">Tên</label>
                                                    <input type="text" class="form-control" id="name" placeholder="Tên" />
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div class="form-group">
                                                    <label for="phone">Số điện thoại</label>
                                                    <input type="text" class="form-control" id="phone" placeholder="Số điện thoại" />
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div class="form-group">
                                                    <label for="website">Số CMND/CCCD</label>
                                                    <input type="text" class="form-control" id="id-number" placeholder="CMND/CCCD" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                <h6 class="mt-3 mb-2 text-primary">Thông tin tài khoản</h6>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div class="form-group">
                                                    <label for="user-name">Tên người dùng</label>
                                                    <input type="text" class="form-control" id="user-name" placeholder="Tên người dùng" />
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div class="form-group">
                                                    <label for="password">Mật khẩu</label>
                                                    <input type="password" class="form-control" id="password" placeholder="Mật khẩu" />
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div class="form-group">
                                                    <label for="email">Email</label>
                                                    <input type="email" class="form-control" id="email" placeholder="Email" />
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div class="form-group">
                                                    <label for="role">Vai trò</label>
                                                    <input type="text" class="form-control" id="role" placeholder="Vai trò" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                <h6 class="mt-3 mb-2 text-primary">Giới thiệu</h6>
                                            </div>
                                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                <div class="form-group">
                                                    <textarea class="form-control" id="about" rows="5" placeholder="Giới thiệu"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                <div class="btn-right">
                                                    <Button variant='danger'>Hủy</Button>
                                                    <Button>Cập nhật</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                </div>
            </section>
        </div>
    );
}