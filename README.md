# flipperzero-goodies-to-fuzzer
Convert all valid keys from flipperzero-goodies to rfid/ibutton fuzzer format

### Requirements
* Node.JS 16+

### Usage
* Download and unzip archive from [flipperzero-goodies](https://github.com/wetox-team/flipperzero-goodies)
* Put the script in the root "flipperzero-goodies-master" folder next to "intercom-keys"
* Open terminal and run `node flipperzero-goodies-to-fuzzer.js`
* Files like "fuzzer__rfid_EM4100.txt" will be created in the same folder. Move the required files to ibtnfuzzer or rfidfuzzer, respectively
