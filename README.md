# DY_exercise

## Lambda_schedule directory

### email_feeder.js - used to email the person who feeds the cat A.K.A 'feeder'
uses the mailgun-js package.

  To use, make an account at [mailgun.com](https://mailgun.com/).
  You will need to insert your Domain and API Key (inside your domain) to the config.json file in the dir.
  
  The 'config.json' files holds more options for configurations including (must fill in the needed)
  - API_key (needed)
  - domain (needed)
  - from_mail (needed)
  - to_mail (needed)
  - subject_warning
  - body_warning
  - subject_normal
  - body_normal
  - bucket (needed)
    thats the s3 bucket name in aws)
  - src_key (needed) 
    the file that is used to check the time from last feeding
    **the src_key needs to be the same as the dst_key in the Lambda_bucket config.json file**
  - dst_key
    it is used for debugging, and also to see how the feeding is going.
    
### Lambda_schedule.js - the Lambda function that works every minute to check the src_key if the cat was fed

  to use, make an account at aws.
  
  - make a new lambda function using Node.js 4.3 runtime.   
  - Handler needs to be Lambda_schedule.handle
  - Create a new custom role to get and **put** objects in s3. 
    ```
    {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Effect": "Allow",
              "Action": [
                  "s3:GetObject",
                  "s3:PutObject"
              ],
              "Resource": "arn:aws:s3:::*"
          }
      ]
    }
    ```
  - go to CloudWatch events and make a new rule
  - select event source Schedule and use fixed rate 1 minute
  - in the targets add our lambda function
  
## Lambda_bucket directory

### labelDetection.js - used to detect the labels in a picture according to google vision engine and compare then to certain cat foods

  To use, you need to make an account at google cloud services. 
  make a new project and create a new service account key credentials. 
  Download it to your computer and put it in the Lambda_bucket directory.
  Put the projectID and the location of the service account key you download in KeyFile in the config.json file 
  
  The 'config.json' files holds more options for configurations including (must fill in the needed)
  - keyFile (needed)
  - projectId (needed)
  - bucket (needed - same bucket as lambda_schedule)
  - dst_key (needed - **same as the src_key in lambda_schedule config file**)
  - catFoods 
    it hols the three cat foods given to me, change as you like.
  
### Lambda_bucket.js - the Lambda function that reacts to new files being added to s3 bucket

  to use, make an account at aws. use the same bucket as before.
  
  - make a new lambda function using Node.js 4.3 runtime. 
  - in triggers use s3. 
  - The event type should be Object Created. 
    prefix of jpg and png can be used though i am searching for it in this function. 
  - Handler needs to be Lambda_bucket.handle
  - Create a new custom role to get and **put** objects in s3. 
    ```
    {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Effect": "Allow",
              "Action": [
                  "s3:GetObject",
                  "s3:PutObject"
              ],
              "Resource": "arn:aws:s3:::*"
          }
      ]
    }
    ```
    
## compile and deploy the lambda functions

  in Lambda_schedual we require mailgun-js so we need npm to install that package
  in Lambda_bucket we require google-cloud so we need npm to install that package
  
  in Lambda_schedule zip Lambda_schedule.js email_feeder.js, config.json and the node_modules.
  and upload it to the right lambda function (that is listening on cloudwatch scheduled event)

  in Lambda_bucket zip Lambda_bucket.js, labelDetection.js, config.json, your service account key and the newly acquired node_modules
  and upload it to the right lambda function (that is listening on s3 Object Created events)
  
  continue reading in case it doesnt work for you
  
## error with connecting to either mailgun-js or google vision labeldetection -

the problem is that the npm package installation will be suited to our machine and maybe not to the lambda function environment

we need to open an ec2 virual linux instance and do the following :
  
  - Create a vanilla Ubuntu micro EC2 instance
  - Launch the instance and save the pem file (private key)
  - Make sure that pem file has correct permissions
      chown :Users node.pem
      chmod 400 node.pem
  - ssh -i \<private_key\> ubuntu@\<Public IP\>
  
inside the ubuntu we need to install npm
  
  - sudo apt-get update
  - sudo apt-get install libssl-dev g++ make (to compile the npm)

npm has NODE_MODULE_VERSIONs, apparently the lambda function uses version 46 (the current is 48 or 51)
so we need to download the right npm version from the site. 
so go on to nodejs.org, other downloads, previous releases, choose one of the 46 versions
which will get you [https://nodejs.org/download/release/v4.6.1/](https://nodejs.org/download/release/v4.6.1/).
  
  - wget https://nodejs.org/download/release/v4.6.1/node-v4.6.1.tar.gz
  - tar -xvf \<tar file\>
  - cd \<node dir\>
  - ./configure && make && sudo make install

now you can copy the files with in your original machine. the dst will be ubuntu@<public IP>:~/<dir>
  
  - scp -i \<private_key\> \<src\> \<dst\>
  
back in the ubuntu 
  
  - npm install google-cloud or mailgun-js (according to the node_modules you need)
  
tar the node_modules and send it to your computer with scp again
  
Now You can finally do reach the end of this long voyage
  
  


