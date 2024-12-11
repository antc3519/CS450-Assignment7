import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      colorType: 'sentiment',
      selectedTweets: [],
    };
  }

  handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const jsonData = JSON.parse(e.target.result);
        const trimmedData = jsonData.slice(0, 300);
        this.setState({ data: trimmedData });
        this.renderGraph(trimmedData);
      };
      reader.readAsText(file);
    }
  };

  renderGraph = (data) => {
    
    const svgWidth = 1000;
    const svgHeight = 600;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;
    
    d3.select("svg").remove()
    const svg = d3.select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("margin-top", margin.top)
      .style("margin-right", margin.right)
      .style("margin-bottom", margin.bottom)
      .style("margin-left", margin.left);

    // Prepare data
    const months = [...new Set(data.map(d =>d.Month))];
    const yScale = d3.scaleBand().domain(months).range([0, height]).padding(0.1)

    const simulation = d3.forceSimulation(data)
      .force('y', d3.forceY(d => yScale(d.Month) + yScale.bandwidth() / 2).strength(5))
      .force('x', d3.forceX(d => width/2).strength(.1))
      .force('collide', d3.forceCollide(10))

    const colors = this.getColors('sentiment')

    const points = svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', d => colors(d.Sentiment))
      .on('click', (event, d) => this.handleClick(event, d))

      simulation.on('tick', () => {
        points
          .attr('cx', d => {
            if (isNaN(d.x)) console.warn('Invalid x:', d);
            return d.x || 0;
          })
          .attr('cy', d => {
            if (isNaN(d.y)) console.warn('Invalid y:', d);
            return d.y || 0;
          });
      });

    svg.selectAll('text')
      .data(months)
      .enter()
      .append('text')
      .attr('x', '0')
      .attr('y', d => yScale(d) + yScale.bandwidth() / 2)
      .text(d => d)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')

      this.updateLegend(colors, "sentiment")
  };

  getColors = (type) => {
    if (type === 'sentiment') {
      return d3.scaleLinear().domain([-1, 0, 1]).range(['red', '#ECECEC', 'green']);
    } else {
      return d3.scaleLinear().domain([0, 1]).range(['#ECECEC', '#4467C4']);
    }
  };

  handleClick = (event, d) => {
    const circle = event.target
    
    var tweets = this.state.selectedTweets
    console.log(d)
    var tweet = d.RawTweet
    if(!tweets.includes(tweet)){
      tweets = [tweet, ...tweets]
      d3.select(circle).attr('stroke', "black")
    }
    else{
      tweets = tweets.filter(function(item) {return item !== tweet})
      d3.select(circle).attr('stroke', "")
    }

    this.setState({selectedTweets: tweets})

    d3.select("#tweets").selectAll('*').remove()
    tweets.forEach(tweet => {
      d3.select("#tweets").append("p").text(tweet).style("padding", "5px")
    });
      
  }

  handleDropdown = (event) => {
    const colorType = event.target.value
    const colorScale = this.getColors(colorType)

    d3.select("svg")
      .selectAll('circle')
      .transition()
      .duration(500)
      .attr('fill', d => colorType === 'sentiment' ? colorScale(d.Sentiment) : colorScale(d.Subjectivity));
    
      this.setState({ colorType })
    
    this.updateLegend(colorScale, colorType)
  }

  updateLegend = (colorScale, type) => {
    
    var topLabel = "Positive"
    var bottomLabel = "Negative"

    if (type !== 'sentiment') {
      topLabel = "Subjective"
      bottomLabel = "Objective"
    }

    d3.selectAll('.legend').remove()
    
    console.log(colorScale(-1))
    const svg = d3.select("svg")
    const width = svg.node().getBoundingClientRect().width

    const legendWidth = 20;
    const legendHeight = 200;
    const legendX = width - 100;
    const legendY = 100;

    const defs = svg.append('defs').attr('class', 'legend');
    const linearGradient = defs.append('linearGradient')
      .attr('id', 'sentimentGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    linearGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', colorScale(1)); // Positive sentiment
    linearGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', colorScale(0)); // Neutral sentiment
    linearGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', colorScale(-1)); // Negative sentiment

    svg.append('rect')
      .attr('class', 'legend')
      .attr('x', legendX)
      .attr('y', legendY)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#sentimentGradient)')
      
    svg.append('text')
      .attr('class', 'legend')
      .attr('x', legendX + legendWidth) // Position to the right of the legend
      .attr('y', legendY) // Top of the legend
      .attr('text-anchor', 'start') // Align the text
      .attr('font-size', '12px') // Font size
      .attr('fill', 'black') // Text color
      .text(topLabel);

    svg.append('text')
      .attr('class', 'legend')
      .attr('x', legendX + legendWidth) // Position to the right of the legend
      .attr('y', legendY + legendHeight + 20) // Bottom of the legend, with some padding
      .attr('text-anchor', 'start') // Align the text
      .attr('font-size', '12px') // Font size
      .attr('fill', 'black') // Text color
      .text(bottomLabel);

    const legendScale = d3.scaleLinear()
      .domain(colorScale.domain()) // Use the same domain as the color scale
      .range([legendY + legendHeight, legendY]); // Map to the legend's position

    svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${legendX + legendWidth + 10}, 0)`)
  }

  render() {
    return (
      <div>
        <h1>Twitter Dashboard</h1>
        <input type="file" accept=".json" onChange={this.handleFileUpload} />
        <select value={this.state.colorType} onChange={this.handleDropdown}>
          <option value="sentiment">Sentiment</option>
          <option value="subjectivity">Subjectivity</option>
        </select>
        <div id='container'>
          {this.state.selectedTweets.forEach(tweet => {
            <div>
              <h3>Selected Tweets:</h3>
              <ul>
                {this.state.selectedTweets.map(tweet => (
                  <li key={tweet.Idx}>{tweet.RawTweet}</li>
                ))}
              </ul>
            </div>
          })}
        </div>
        <div id='tweets'>

        </div>
      </div>
    );
  }
}

export default App;
