import './CateSquare.scss';
import * as Icon from 'react-bootstrap-icons';
import { Interweave } from 'interweave';
import { UrlMatcher, HashtagMatcher } from 'interweave-autolink';
import {Row, Col, Container} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function CateSquare({id, avatar, name, desc, courseCount, IDNumber}) {
    const navi = useNavigate();
    if (desc.length > 100) {
        desc = desc.slice(0, 100) + '...';
    }
    if (desc.length === 0) {
        desc = 'Không có mô tả';
    }
    return (
        <div className="cate-square">
            <Container className="cate-box">
                <Row className="image-wrap">
                    <img onClick={()=>navi('/course-list?cateid='+id)} src={avatar} alt="" />
                </Row>
                {/* end image-wrap */}
                <Row className="cate-details">
                    <div className="cate-name" onClick={()=>navi('/course-list?cateid='+id)}>
                        <h4 className="title">
                            {name}
                        </h4>
                    </div>
                    Mô tả: 
                    <Interweave className="cate-desc" content={desc}
                        matchers={[new UrlMatcher('url'), new HashtagMatcher('hashtag')]}
                        newWindow
                    />
                    
                </Row>
                {/* end details */}
                <Row className="cate-footer">
                    <Col md={6} lg={6}>
                        <p>
                        Số khóa học: <Icon.Server style={{color: '#01bacf'}} />{courseCount}
                        </p>
                        <p>
                        Mã danh mục: <b>{IDNumber}</b>
                        </p>
                    </Col>
                    <Col md={6} lg={6}>
                        
                    </Col>
                </Row>
            </Container>
        </div>
    )
}