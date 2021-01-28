<template>
<div class="roo">
  <div id="app">

    <router-view/>
  </div>
</div>
</template>

<style>
html {
  box-sizing: border-box;
}
*,
*::before,
*::after {
  box-sizing: border-box;
}
body{
  margin:0;
  padding:0;
  background-color: #2c3e50;
}
.roo{
  width:100%;
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  
}
 @media screen and (max-width: 640px) {
   #app{
     width:100%;
   }
 }
  @media screen and (min-width: 640px) {
   #app{
     width:600px;
   }
 }


</style>
