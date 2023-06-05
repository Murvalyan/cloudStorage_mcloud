class UserDto {
    email;
    id;
    isActivated;

    constructor(obj) {
        this.email = obj.email;
        this.id = obj.id;
        this.isActivated = obj.isactivated;
    }
}


module.exports = UserDto;