# Movies App

# How to run
- create .env file and set a VITE_BASE_URL variable to the url of api
- run `npm install`
- run `npm run dev`

# Interesting or Significant to overall implementation
- used `tanstack query` to manage state changes in the api calls like error scenarios and wait times in order to avoid boiler plate
- using `tanstack query` allowed me to easily use signal in order to abort api calls in order to reduce load on the servers if the user leaves the page

# Most pleased or proud part of implementation
- being able to effectively show good responses for when there are no search results
- good user experience by making the app as easy to understand and use
- making sure to include accessibility as I am coding the UI
- using vite since it is has better performance than webpack

# Future improvements
- add unit tests using vitest
- add playwright tests for integration
- break out some of the useQuery into their own custom hooks
- add being able to click on the tiles and display more info about movies like a modal or another page