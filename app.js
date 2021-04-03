//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/adminDB", {
  useNewUrlParser: true
});

const userSchema = {
  email: String,
  password: String
};
const donorSchema = {
  demail: String,
  dpassword: String
};

const ngoSchema = {
  nemail: String,
  npassword: String
};

/*Ngo Docs Schema*/

const ngoDocsSchema = {
  email: String,
  password: String,
  address: String,
  city: String,
  state: String,
  zip: Number,

  registration: {
    data: Buffer,
    contentType: String
  },

  society: {
    data: Buffer,
    contentType: String
  },

  pan: {
    data: Buffer,
    contentType: String
  },

  balance: {
    data: Buffer,
    contentType: String
  },

  annual: {
    data: Buffer,
    contentType: String
  },


  tan: {
    data: Buffer,
    contentType: String
  },

  certificate12a: {
    data: Buffer,
    contentType: String
  },

  certificate80g: {
    data: Buffer,
    contentType: String
  }

};
/*End of Ngo Docs Schema*/

/*Generating Request Schema*/

const itemsSchema = {
  name :String
};




/*End of Genearting Request Schema*/



const User = new mongoose.model("User", userSchema);

const Donor = new mongoose.model("Donor", donorSchema);

const Ngo = new mongoose.model("Ngo", ngoSchema);

const NgoDoc = new mongoose.model("NgoDoc", ngoDocsSchema);

const Item =mongoose.model("Item",itemsSchema);

/*code for Genearting Request*/

const item1 = new Item({
  name :"Request 1"
});

const item2 = new Item({
  name: "Request 2"
});

const item3 = new Item({
  name :"Request 3"
});

const defaultItems =[item1, item2, item3];


/*end of Code for Genearting Request*/

app.post("/adminRegister", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err) {
    if (err) {
      console.log(err)
    } else {
      res.render("adminIndex");
    }
  });
});

app.post("/donorRegister", function(req, res) {
  const newDonor = new Donor({
    demail: req.body.dusername,
    dpassword: req.body.dpassword
  });

  newDonor.save(function(err) {
    if (err) {
      console.log(err)
    } else {
      res.render("donorSite");
    }
  });
});

app.post("/ngoRegister", function(req, res) {
  const newNgo = new Ngo({
    nemail: req.body.nusername,
    npassword: req.body.npassword
  });

  newNgo.save(function(err) {
    if (err) {
      console.log(err)
    } else {
      res.render("ngoDocs");
    }
  });
});




app.post("/adminLogin", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    email: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("index");
        }
      }
    }
  });
});

app.post("/donorLogin", function(req, res) {
  const dusername = req.body.dusername;
  const dpassword = req.body.dpassword;

  Donor.findOne({
    demail: dusername
  }, function(err, dfoundUser) {
    if (err) {
      console.log(err);
    } else {
      if (dfoundUser) {
        if (dfoundUser.dpassword === dpassword) {
          res.render("donorSite");
        }
      }
    }
  });
});

app.post("/ngoLogin", function(req, res) {
  const nusername = req.body.nusername;
  const npassword = req.body.npassword;

  Ngo.findOne({
    nemail: nusername
  }, function(err, nfoundUser) {
    if (err) {
      console.log(err);
    } else {
      if (nfoundUser) {
        if (nfoundUser.npassword === npassword) {
          res.render("ngoSite");
        }
      }
    }
  });
});

app.post("/ngoDocs", function(req, res) {
  const newNgoDoc = new NgoDoc({
    email: req.body.ndemail,
    password: req.body.ndpassword,
    address: req.body.ndaddress,
    city: req.body.ndcity,
    state: req.body.ndstate,
    zip: req.body.ndzip,
    registration: req.body.nd1,
    society: req.body.nd2,
    pan: req.body.nd3,
    balance: req.body.nd4,
    annual: req.body.nd5,
    tan: req.body.nd6,
    certificate12a: req.body.nd7,
    certificate80g: req.body.nd8
  });
  newNgoDoc.save(function(err) {
    if (err) {
      console.log(err)
    } else {
      res.render("ngoLogin");
    }
  });

});

/*genearting request  for Donor*/

app.get("/ngoRequest", function(req, res) {

  Item.find({}, function(err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default items to DB.");
        }
      });
      res.redirect("/ngoRequest");
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });
    }
  });



});


app.post("/ngoRequest", function(req, res) {

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/ngoRequest");




});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function(err) {
    if (!err) {
      console.log("Successfully deleted checked item.");
      res.redirect("/ngoRequest");
    }
  });

});


/*End of genearting request  for Donor*/

/*Generating Date for Donation*/

function randomDate(date1, date2){
    function randomValueBetween(min, max) {
      return Math.random() * (max - min) + min;
    }
    var date1 = date1 || '01-01-1970'
    var date2 = date2 || new Date().toLocaleDateString()
    date1 = new Date(date1).getTime()
    date2 = new Date(date2).getTime()
    if( date1>date2){
        return new Date(randomValueBetween(date2,date1)).toLocaleDateString()
    } else{
        return new Date(randomValueBetween(date1, date2)).toLocaleDateString()

    }
}


app.get("/donationDate", function(req, res) {

const date = randomDate('06/23/2020', '05/23/2020');

  res.render("donationDate", {date: date});

});



/*End of Generating Date for Donation*/





app.get("/",function(req,res){
  res.render("homepage");
});

app.get("/adminHome", function(req, res) {
  res.render("adminHome");
});
app.get("/adminLogin", function(req, res) {
  res.render("adminLogin");
});
app.get("/adminRegister", function(req, res) {
  res.render("adminRegister");
});


app.get("/donorHome", function(req, res) {
  res.render("donorHome");
});
app.get("/donorLogin", function(req, res) {
  res.render("donorLogin");
});
app.get("/donorRegister", function(req, res) {
  res.render("donorRegister");
});

app.get("/ngoHome", function(req, res) {
  res.render("ngoHome");
});
app.get("/ngoLogin", function(req, res) {
  res.render("ngoLogin");
});
app.get("/ngoRegister", function(req, res) {
  res.render("ngoRegister");
});

app.get("/donorDetails", function(req, res) {
  res.render("donorDetails");
});

app.get("/donorSite", function(req, res) {
  res.render("donorSite");
});

app.post("/donorDetails", function(req, res) {
  res.render("donorSite");
});

app.get("/donateHistory",function(req,res){
  res.render("donateHistory");
});

app.get("/donationReport",function(req,res){
  res.render("donationReport");
});








app.listen(3000, function() {
  console.log("Server is running at Port 3000");
});
