// https://docs.google.com/document/d/19y3enRYrH4D2nJ2UGqIp_rV2P_lihte3wU8Mhj41bZg/edit
//create micro service
// 1] this microservice will be a hotel used for crud hotel 
//each hotel there will be a database with chainId and hotelId where we store hotel details
// if a owner has 5 chain hotels he will create 5 hotels with same chainId
//this db will save all info of a hotel  hotelDb1,hotelDb2....
// 2]this microservice is used to crud guests,input will have chainId and hotelId
// this db will store only guests info with hoteId and chainId  guestDb
//3]microservice simmilarly for services


// 1]microservice for crud hotel,guests
// hoteldb1-hotelcollection,guests--- chainId_hotel_iddbname  
// hoteldb2-hotelCollection,guests

// 2]services microservice for crud service
// will take hotelId,chainId as input to create services
// servicedb
// for food catelog inputs will be hotelId,chainId,(guestId - case user creating order)
//note no guest front work here,work is only for hotel front and ownerside

// -----drawbacks----
// cannot update a hotelname or a chain name,in order to do this we have to implement something like requesting for hotel name change 
// and then manually create db with requredname delete existing one




// simple stores all info redunduntly
// 1] hotel is a microservice with 1db with list of all hotels and chains
// 2] guests is a mocroservice with hotelIds and chainIds 
// 3] service is ....       
// each with their own db 
// adding a guest will save guest info in guestdb as well as hoteldb(simple infos only like numberofguests)