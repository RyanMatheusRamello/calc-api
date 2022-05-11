const express = require("express");
const mathsteps = require("mathsteps");

const app = express()

app.use(function(req, res, next){
  
  if(req.method !== "GET"){
    
    return res.send({
      status: 405,
      code: 4000,
      message: "Método não permitido"
    })
    
  }
  
});

app.get("/", function(req, res){
  
  res.send({
    routers: [
      
      "/simplify",
      "/resolve",
      "/errors"
      
    ]
  })
  
});

let errors = {
  "4000": {
    "en": "Method not allowed",
    "pt-BR": "Método não permitido"
  },
  "4001": {
    "en": "You didn't send the equation",
    "pt-BR": "Você não enviou a equação"
  }
}

app.get("/simplify", function(req, res){
  
  if(!req.query.equation){
    return res.status(400).send({ status: 400, code: 4001, message: "Você não enviou a equação" })
  }
  
  let equation = req.query.equation;
  
  const steps = mathsteps.simplifyExpression(equation);
  
  var _steps = []
  var _result = null;
  
  steps.forEach(step => {
    let data = {}
    data.beforeChange = step.oldNode.toString();
    data.changeType = step.changeType;
    data.afterChange = step.newNode.toString();
    data.substeps = step.substeps.length;
    _result = `${data.afterChange}`;
    _steps.push(data)
  });
  
  res.send({
    status: 200,
    code: 200,
    data: {
      result: _result,
      steps: _steps
    }
  })
  
})

app.listen(3000, ()=>console.log("Server Running"));
