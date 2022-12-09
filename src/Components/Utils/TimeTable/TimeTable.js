import './TimeTable.scss';
import { Button, Table } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { useState,useContext,useEffect } from 'react';
import { Context } from '../ContextProvider';
export default function TimeTable({value}) {
    const {string2time,moodleHome} = useContext(Context);
    const [scheHtml, setScheHtml] = useState();

    //value = [{'day':'2',start:'8:00',end:'10:00',fullname:'ltw',id:'1'},{'day':'3',start:'8:00',end:'10:00',fullname:'lt java',id:'2'},{'day':'4',start:'8:00',end:'10:00',fullname:'python',id:'1'}]
    
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
            var newItem = {...item};
            if(!newItem.fullname) newItem.fullname = '';
            if(!newItem.id) newItem.id = '-1';
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
                    <td key={key+'-'+i} style={{ backgroundColor: "#fff" }}>{
                        <div>
                            {scheArr[key][i].id === '-1' ?
                            <p>{scheArr[key][i].fullname}</p>:
                            <a href={moodleHome + '/course/view.php?id=' + scheArr[key][i].id} target="_blank" rel="noreferrer">{scheArr[key][i].fullname}</a>}
                            <p style={{color:'#000'}}>{scheArr[key][i].start + ' - ' + scheArr[key][i].end}</p>
                        </div>
                    }</td>
                    )
                } else {
                    row.push(<td key={key+'-'+i}></td>)
                }
            }
            html.push(<tr key={i}>{row}</tr>)
        }
        // move first column to last column because we want to start from monday
        html.forEach((item) => {
            var first = item.props.children[0];
            item.props.children.splice(0, 1);
            item.props.children.push(first);
        })
        setScheHtml(html);
    }, [value]);

    return (
        <Table responsive style={{textAlign: 'center'}} size="sm" striped bordered hover>
            <thead>
                <tr>           
                    <th>Thứ 2</th>
                    <th>Thứ 3</th>
                    <th>Thứ 4</th>
                    <th>Thứ 5</th>
                    <th>Thứ 6</th>
                    <th>Thứ 7</th> 
                    <th>Chủ nhật</th>
                </tr>
            </thead>
            <tbody>
                {scheHtml}
            </tbody>
        </Table>
    )
}