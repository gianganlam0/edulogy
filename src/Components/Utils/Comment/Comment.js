import './Comment.scss';
import { Button } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
export default function Comment(props) {
    return (
        <div className="comment">
            <p class="time"><small>5 days ago</small></p>
            <img src={props.src} alt=""/>
            <div class="media-body">
                <h4 class="user-name">An Lam</h4>
                <p>Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed. Craft beer elit seitan exercitation, photo booth et 8-bit kale chips proident chillwave deep v laborum. Aliquip veniam delectus,
                </p>
            </div>

            <div className="rating-star">
                Đánh giá: 4.5/5 <Icon.StarFill/>
            </div>
            <Button variant="danger">Xóa bình luận</Button>
            <hr/>
        </div>
    )
}