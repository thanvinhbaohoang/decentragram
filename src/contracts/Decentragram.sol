pragma solidity >0.5.0;

contract Decentragram {
  // Code goes here...
  string public name = "Decentragram";

  //1. Store Images
  // Create Map To Store Images
  uint public imageCount = 0; // Generate ID for image
  mapping(uint => Image) public images;

  //Create Image Object (Struct)
  struct Image{
    uint id;
    string hash;
    string imgDescription;
    uint tipAmount;
    address payable author;
  }

  // Event To Let Know Whe Image Is Created
  event ImageCreated(uint id, string hash, string imgDescription, uint tipAmount, address payable author);
  //2. Create Images
  // _imgHash, _description (underscore) is naming conconvention for local variable
  function uploadImage(string memory _imgHash, string memory _description) public {
    // Make sure image ID Exist
    require(bytes(_imgHash).length > 0);
    // Make sure Description Exist
    require(bytes(_description).length > 0);
    // Make sure Uploader Address Exist (NOT EMPTY)
    require(msg.sender != address(0x0));

    // Increment Image ID
    imageCount ++;

    //Add Image To Contract 
    images[imageCount] = Image(imageCount, _imgHash, _description, 0, msg.sender); 

    //Trigger an event
    emit ImageCreated(imageCount, _imgHash, _description, 0, msg.sender);
  }
  
  //3. Tip Image Owner
  event ImageTipped(uint id, string hash, string imgDescription, uint tipAmount, address payable author);
  function tipImageOwner(uint _id) public payable {
    // Check to make sure ID is Valid
    require(_id > 0 && _id <= imageCount);

    // Fetch the image
    Image memory _image = images[_id];
    // Fetch author
    address payable _author = _image.author;
    // Seend value that this function charges to author
    _author.transfer(msg.value);
    // Increment Tip Amount
    _image.tipAmount += msg.value;
    // Update the image
    images[_id] = _image;

    // Trigger Tipping Event
    emit ImageTipped(_image.id, _image.hash, _image.imgDescription, _image.tipAmount, _author);
  }
}