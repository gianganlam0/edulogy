import './CourseSquare.scss';
import * as Icon from 'react-bootstrap-icons';
import { Interweave } from 'interweave';
import { UrlMatcher, HashtagMatcher } from 'interweave-autolink';
export default function CourseSquare({id, avatar, name, desc, courseCount, IDNumber, onClick}) {
    return (
        <div className="course-square" onClick={onClick}>
            <div className="course-box">
                <div className="image-wrap">
                    <img src={avatar} alt="" />
                </div>
                {/* end image-wrap */}
                <div className="course-details">
                    <h6 className="cate-name">
                        {/* {cateName} */}
                    </h6>
                    <h4>
                        <div className="title">
                            {name}
                        </div>
                    </h4>
                    <Interweave content={desc}
                        matchers={[new UrlMatcher('url'), new HashtagMatcher('hashtag')]}
                        newWindow
                    />
                </div>
                {/* end details */}
                <div className="course-footer">
                    <div className="pull-left">
                        <div>
                        Số khóa học: <Icon.Server style={{color: '#01bacf'}} />{courseCount}
                        </div>
                        <div>
                        Mã danh mục: <b>{IDNumber}</b>
                        </div>
                    </div>
                    <div className="pull-right">
                        
                    </div>
                </div>
            </div>
        </div>
    )
}