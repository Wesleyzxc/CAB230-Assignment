import React from "react";
import { Bar } from "react-chartjs-2";
import "./mainstyle.css";


/**
 * Creates a bar chart with props of LGA, total, showChart
 * @param {*} props string LGA, int total and showChart bool
 */
export function Chart(props) {
    let crimeCount = [];
    let areaCount = [];

    // So that graph doesn't assign to first LGA if areaParam is specified
    props.searchResult.forEach(each => {
        crimeCount.push(each.total);
        areaCount.push(each.LGA);
    });

    const data = {
        labels: areaCount,
        datasets: [
            {
                label: "Offence count",
                data: crimeCount,
                backgroundColor: "rgba(255,99,132,1)",
                borderColor: "red",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)"
            }
        ]
    };

    if (props.showChart === false) {
        return null;
    }
    return (
        <div className="chart">
            <Bar data={data} />
        </div>
    );
}