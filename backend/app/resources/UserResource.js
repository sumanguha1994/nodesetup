const Resource = require("resources.js");

class UserResource extends Resource {
  toArray() {
    let doc = {
      _id: this._id || null,
      role: this.role || null,
      name: this.name || null,
      email: this.email || null,
      mobile: this.mobile || null,
      image: this.image || null,
      status: this.status || null,
      email_verified_at: this.email_verified_at || null,
      mobile_verified_at: this.mobile_verified_at || null,
      created_at: this.created_at || null,
      updated_at: this.updated_at || null,
    };

    return doc;
  }
}

module.exports = UserResource;
