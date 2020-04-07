## Some notes for this assignment

- Overall structure: I used axisDisplay for displaying and updating the axis. GraphDisplay function for displaying the initial graph before changing the data.

- Color change: I had several issues with the animation of changing color. Which turned out to be the problem of using duration and appending extra groups.(see details below)

- Transition: No need to append extra shapes when using the transition. Consider it as a separate part related with css(?). The position to apply the transition will also result in different animation. Like when removing element I should apply the transition on the remove operation instead of using it when doing select("rect"). When there are multiple places to use transition it's better to have a variable.

- Selection and remove: exitingElements.select("rect").remove() will only delete the rectangle but leave the blank datagroup(g) on the page. Instead, I should do exitingElements.remove(); to remove the whole datapoint group.

- Assign keys: assign data key addressed the problem of showing color change when add and remove at the same time.

- Problems to address: I initially want to use just two function to control the change on axis and graphs. I didn't get there yet.
