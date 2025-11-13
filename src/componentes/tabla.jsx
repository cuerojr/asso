import React from 'react';

const Tabla = (props) => {
    return (
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                    <tr>
                        {props.data && props.data.map((c,ind) => {
                            return (
                            <th key={ind}>{c}</th>
                        )})}
                    </tr>
                </thead>
                <tbody>
                    {props.cols && props.cols.map((r, i) => {
                        console.log(r)
                        return(
                        <tr key={i}>
                            {props.cols && props.cols.map((c,ind) => {
                                console.log(c)
                                return (
                                <td key={c}>{r[ind]}</td>
                            )})}
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
    );
};

export default Tabla;