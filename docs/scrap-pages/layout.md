```
<div class="container">
  <div class="tag0"></div>
  <div class="tag1"></div>   
   <img src="https://dl.dropboxusercontent.com/u/13246619/UDOO/udoo-top-view.png">
</div>
```

```
.container {
   border: 1px solid #DDDDDD;
   width: 200px;
   height: 200px;
   position: relative;
}
.tag0 {
   float: left;
   width: 15px;
   height: 15px;   
   position: absolute;
   left: 210px;
   top: 48px;
   background-color: green;
}

.tag1 {
   float: left;
   position: absolute;
   width: 5px;
   height: 5px;
   left: 235px;
   top: 48px;
   background-color: red;
}
```

Define a pinHeader object

Should contain

name : the name of the header  (J6)
xy-coords : the top xy coords (210,45)
rows : nr of rows (10)
cols : nr of columns (2)
space-x : space between items on same row in px (25)
space-y : space between items on same column in px ()


pinHeader is a collection of divs that are put on top of an image.


checkout this : https://facebook.github.io/react/tips/inline-styles.html
