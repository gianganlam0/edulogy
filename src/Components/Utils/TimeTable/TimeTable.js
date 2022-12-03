import './TimeTable.scss';
import { Button, Table } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { useState,useContext,useEffect } from 'react';
import { Context } from '../ContextProvider';
export default function TimeTable({value}) {
    const {string2time} = useContext(Context);
    const [scheHtml, setScheHtml] = useState();

    //value = [{'day':'2',start:'8:00',end:'10:00'},{'day':'3',start:'8:00',end:'10:00'},{'day':'4',start:'8:00',end:'10:00'}]
    
    useEffect(() => {
        var scheArr = {
            '2': [],
            '3': [],
            '4': [],
            '5': [],
            '6': [],
            '7': [],
            '1': []
        }
        var maxRow = 0;
        value.forEach((item) => {
            var newItem = {
                start: item.start,
                end: item.end,
            }
            scheArr[item.day].push(newItem);
            if (scheArr[item.day].length > maxRow) {
                maxRow = scheArr[item.day].length;
            }
        })
        //now sort scheArr[key] by string2time(start) value
        for (var k in scheArr) {
            scheArr[k].sort((a, b) => {
                return string2time(a.start) - string2time(b.start);
            })
        }
        //now create html
        var html = [];
        for (var i = 0; i < maxRow; i++) {
            var row = [];
            for (var key in scheArr) {
                // nó chạy từ key = 1 trước
                if (scheArr[key][i]) {
                    row.push(
                    <td key={key+'-'+i} style={{ backgroundColor: '#f8f9fa' }}>{scheArr[key][i].start + ' - ' + scheArr[key][i].end}</td>
                    )
                } else {
                    row.push(<td key={key+'-'+i}></td>)
                }
            }
            html.push(<tr key={i}>{row}</tr>)
        }
        setScheHtml(html);
    }, [value]);

    return (
        <Table responsive style={{textAlign: 'center'}} size="sm" striped bordered hover>
            <thead>
                <tr>
                    <th>Chủ nhật</th>
                    <th>Thứ 2</th>
                    <th>Thứ 3</th>
                    <th>Thứ 4</th>
                    <th>Thứ 5</th>
                    <th>Thứ 6</th>
                    <th>Thứ 7</th> 
                </tr>
            </thead>
            <tbody>
                {scheHtml}
            </tbody>
            </Table>
    )
}