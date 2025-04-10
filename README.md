# React + TypeScript + Vite

##### HOW TO USE:
- Clone this project 
```js
   git clone git@github.com:freelance-wigan/5R-React.git
```
- Install dependencies
```js
   npm i
```
- Rename file .env.example to .env
- Setup your .env by following command instruction
- Run project
```js
   npm run dev
```

#### FOLDER STRUCTURE
```bash
├───public
├───src                    # folder with main code
│   ├───assets
│   ├───components         # component structure use atomic. main component already include
│   ├───helpers
│   ├───pages              # main page your project
│   │   ├───home           # dont remove or change, it use by default page when fail to get several configuration
│   │   └───your-page-name # this is your main folder page #start code here
│   ├───store              # folder of collection redux store & query condfiguration
│   ├───type               # folder of collection global type (typescript)
│   ├───App.tsx
│   ├───custom.css
│   ├───index.css
│   ├───main.tsx
│   └───vite-env.d.ts
├───.env.example           # env template, rename and config this file in first setup
├───.eslintrc.cjs       
├───.gitignore          
├───.index.html         
├───.package-lock.json     # dont recomended to delete and install newest version of every library
├───.package.json
├───.postcss.config.js          
├───README.md
├───tailwind.config.js
├───tsconfig.js
├───tsconfig.node.js
└───vite.config.js
```

## Library (Dependencies) already includes
```js
"dependencies": {
    "@inovua/reactdatagrid-community": "^5.9.4",                  //recomended for datatable
    "@reduxjs/toolkit": "^1.9.7",                                 //required for core management state
    "lodash": "^4.17.21",                                         //recomended for manipulate data
    "moment": "^2.29.4",                                          //recomended for manupulate date
    "react": "^18.2.0",                                           //required react v18
    "react-datepicker": "^4.21.0",                                //optional for input datepicker
    "react-json-editor-ajrm": "^2.5.14",                          //required for debuging response using global alert component
    "react-redux": "^8.1.3",                                      //required for management state
    "react-router-dom": "^6.17.0",                                //required for routing
    "redux-persist": "^6.0.0",                                    //required as a redux midleware
    "redux-persist-transform-encrypt": "^5.0.0",                  //required by encryption secret on local storage
    "xlsx": "https://cdn.sheetjs.com/xlsx-0.20.0/xlsx-0.20.0.tgz" //optional for exporting data to excel in client side
  }
```