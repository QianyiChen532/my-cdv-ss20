## Several troubleshooting notes:

- remove the created divs should use 'bspace.childNodes[0].remove();' instead of 'bspace.remove();'
- add variation by creating the object in js and do _.className = '' ->to create the class and assign variables
- Occured error about "identifier". Fixed by changing 'const' to 'var'. See details [here](https://stackoverflow.com/questions/55722874/identifier-location-has-already-been-declared)
- change color of the div should use 'backgroundcolor', not 'color'🤦🏻‍♀️
- camelCase for css attribute in js
