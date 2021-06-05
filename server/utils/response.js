
class Response{
    constructor(status,errors = null,message = null,data = null){
        this.status = status,
        this.data = data,
        this.message = message,
        this.errors = errors
    }
}


module.exports = Response