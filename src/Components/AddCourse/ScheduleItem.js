import {Row, Col, Button, Form} from 'react-bootstrap';
import { useState, useEffect } from 'react';
export default function ScheduleItem({value, onChange, onDelete}) {
    const [day, setDay] = useState(value.day);
    const [start, setStart] = useState(value.start);
    const [end, setEnd] = useState(value.end);
    function handleDay(e) {
        setDay(e.target.value);
        value = {...value, day: e.target.value};
        const event = {
            target: {
                name: 'day',
                value: value,
            }
        }
        onChange(event);
    }
    function handleStart(e) {
        setStart(e.target.value);
        value = {...value, start: e.target.value};
        const event = {
            target: {
                name: 'start',
                value: value,
            }
        }
        onChange(event);
    }
    function handleEnd(e) {
        setEnd(e.target.value);
        value = {...value, end: e.target.value};
        const event = {
            target: {
                name: 'end',
                value: value,
            }
        }
        onChange(event);
    }
    useEffect(() => {
        setDay(value.day);
        setStart(value.start);
        setEnd(value.end);
    }, [value]);
    return (
        <Row value={value}>
        <Col lg={4}>
            <Form.Label>Thứ</Form.Label>
            <Form.Select value={day} onChange={handleDay}>
                <option value="2">Thứ 2</option>
                <option value="3">Thứ 3</option>
                <option value="4">Thứ 4</option>
                <option value="5">Thứ 5</option>
                <option value="6">Thứ 6</option>
                <option value="7">Thứ 7</option>
                <option value="1">Chủ nhật</option>
            </Form.Select>
        </Col>
        <Col lg={3}>
            <Form.Label>Giờ bắt đầu</Form.Label>
            <Form.Control value={start} onChange={handleStart} type="time" />
        </Col>
        <Col lg={3}>
            <Form.Label>Giờ kết thúc</Form.Label>
            <Form.Control value={end} onChange={handleEnd} type="time" />
        </Col>
        <Col lg={2}>
            <Form.Label>Thao tác</Form.Label>
            <Button onClick={onDelete} variant="danger" className="w-100">Xóa</Button>
        </Col>
        </Row>
    )
    
}
