# CS450 - Assignment 7
# Website can be viewed here: https://antc3519.github.io/CS450-Assignment7/

Classwork for CS450 - Introduction to Data Visualization

The goal of this assignment is to create a dashboard that visualizes Twitter data, focusing on the sentiments and subjectivity of tweets over different months. You will use a JSON dataset named tweets.json that contains the following information: 
* Idx: Unique identifier for each tweet.
* Month: This column contains information about the month when each tweet was posted. It allows for analysis and visualization of tweet data over different months to identify trends or patterns in the dataset over time.
* Sentiment: The Sentiment column quantifies the emotional tone behind a tweet. It ranges from -1 to +1, where negative scores indicate negative sentiment, positive scores indicate positive sentiment, and scores around zero indicate neutrality.
* Subjectivity: This column measures the subjectivity or objectivity of the tweet's content. Subjectivity scores range from 0 to 1, where 0 represents objective statements and 1 represents subjective statements. Analyzing subjectivity helps in distinguishing between factual and opinion-based tweets.
* Dimension 1 and Dimension 2: These columns are features extracted from the tweet's text through embedding representations and then dimensionality reduction technique (t-SNE). 
* RawTweet: The RawTweet column contains the original text of the tweet. This is the unprocessed tweet data, which includes the message posted by the user.

File Upload and Overall Dashboard Structure (10 points): 
* The overall dashboard will appear as shown below after the user uploads the tweets.json. Your dashboard will closely resemble the example shown below for 300 data points from the dataset.

Visualizing Tweets (75 points):
* Using D3 functions, generate the following visualization where each circle represents a tweet for the associated month, and the color is determined by either the sentiment or subjectivity score, with sentiment as the default. Apply an appropriate scaling function to divide the region for each month. Then, plot a circle for each tweet in the dataset across all three months within their respective regions. Use a force layout to arrange the circles, ensuring they remain close to each other without overlapping.

Dropdown Component and Legend (50 points):
* Create a dropdown menu to set the color of circles based on either Sentiment or Subjectivity scores in the data. When the user selects a value from the dropdown, the colors of the circles and the legend should update accordingly. Ensure that this interaction does not rerender the forcelayout. Use the following scaling functions for both coloring the circles and updating the legend.
  * const sentimentColorScale = d3.scaleLinear().domain([-1, 0, 1]).range(["red", "#ECECEC", "green"]);
  * const subjectivityColorScale = d3.scaleLinear().domain([0,1]).range(["#ECECEC","#4467C4"]);

Tweet Analysis (65 points):
* When the user clicks on a tweet, set its stroke to black to highlight the selection, and display it in a div below the visualization. The displayed tweets should follow the order of selection, with the most recently selected tweet appearing first. If the user clicks on an already selected tweet, it will be unselected and removed from the display below. Ensure that this interaction does not rerender the forcelayout.

Submission: Submit the following on Canvas:
* A zip file of your src folder containing all the files used to generate the visualization.
* A link to your deployed webpage on GitHub Pages.

Note: For this assignment, you must use D3.js and ReactJS class components. The use of third-party packages is not permitted. Partial credit will not be awarded for any component that fails to produce output on the screen.

