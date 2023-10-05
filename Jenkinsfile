// docker
pipeline {
    agent any
   
    environment{
        imagename = "lmslmsms0616/teamchat_front"
        registryCredential = 'docker-hub'
        dockerImage = ''
    }

    stages {
        // git에서 repository clone
        stage('Prepare') {
          steps {
            echo 'Clonning Repository'
            git url: 'https://github.com/KA-ForCloud/Frontend.git',
              branch: 'master'
            }
            post {
             success { 
               echo 'Successfully Cloned Repository'
             }
           	 failure {
               error 'This pipeline stops here...'
             }
          }
        }
        
        // docker build
        stage('Bulid Docker') {
          agent any
          steps {
            echo 'Bulid Docker'
            script {
                dockerImage = docker.build imagename
            }
          }
          post {
            failure {
              error 'This pipeline stops here...'
            }
          }
        }

        // docker push
        stage('Push Docker') {
          agent any
          steps {
            echo 'Push Docker'
            script {
                docker.withRegistry( '', registryCredential) {
                    dockerImage.push("${currentBuild.number}")  // ex) "1.0"
                }
            }
          }
          post {
            failure {
              error 'This pipeline stops here...'
            }
          }
        }

        stage('Remove image in Jenkins'){
            steps{
                sh "docker rmi lmslmsms0616/teamchat_front:${currentBuild.number}"
            }
        }

        stage('Deploy to dev') {
          steps {
                sshagent(credentials: ['kic_key']) {
                    echo "sshagent start"

                    sh "ssh -o StrictHostKeyChecking=no centos@210.109.60.60 -p 10001 uptime"
                    echo "uptime end"
                    sh "ssh -o StrictHostKeyChecking=no centos@210.109.60.60 -p 10001 'sudo chmod 666 /var/run/docker.sock'"
                    sh "ssh -o StrictHostKeyChecking=no centos@210.109.60.60 -p 10001 'docker stop front | true'"
                    sh "ssh -o StrictHostKeyChecking=no centos@210.109.60.60 -p 10001 'docker rm front | true'"
                    echo "docker remove"
                    sh "ssh -o StrictHostKeyChecking=no centos@210.109.60.60 -p 10001 'docker rmi -f lmslmsms0616/teamchat_front:latest | true'"
                    echo "docker remove image"
                    sh "ssh -o StrictHostKeyChecking=no centos@210.109.60.60 -p 10001 'docker run -d --name front -p 80:80 -p 443:443 -p 3000:3000 lmslmsms0616/teamchat_front:${currentBuild.number}'"
                    echo "docker run"
                    
                    slackSend (channel: '#jenkins-alert', color: '#FFFF00', message: "WEB-1-Frontend Deploy Complete: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
                    echo "Web_1_Success"

                    sh "ssh -o StrictHostKeyChecking=no centos@210.109.60.60 -p 10002 uptime"
                    sh "ssh -o StrictHostKeyChecking=no centos@210.109.60.60 -p 10002 'sudo chmod 666 /var/run/docker.sock'"
                    sh "ssh -o StrictHostKeyChecking=no centos@210.109.60.60 -p 10002 'docker stop front | true'"
                    sh "ssh -o StrictHostKeyChecking=no centos@210.109.60.60 -p 10002 'docker rm front | true'"
                    sh "ssh -o StrictHostKeyChecking=no centos@210.109.60.60 -p 10002 'docker rmi -f lmslmsms0616/teamchat_front:latest | true'"
                    sh "ssh -o StrictHostKeyChecking=no centos@210.109.60.60 -p 10002 'docker run -d --name front -p 80:80 -p 443:443 -p 3000:3000 lmslmsms0616/teamchat_front:${currentBuild.number}'"

                    slackSend (channel: '#jenkins-alert', color: '#FFFF00', message: "WEB-2-Frontend Deploy Complete: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
                    echo "Web_2_Success"
                }
            }

           post {
                    failure {
                      echo 'Update 실패ㅠㅠ'
                    }
                    success {
                      echo 'Update 성공!!!! test'
                    }
            }
        }
    }
}


// npm

// node {
//     checkout scm
    
//     stage('build') {
//         nvm(nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh', 
//              nvmIoJsOrgMirror: 'https://iojs.org/dist',
//              nvmNodeJsOrgMirror: 'https://nodejs.org/dist', 
//              version: '16.19.0') {
//                     sh "node -v"
// //                     sh "apt-get update"
// //                     sh "apt-get install gcc g++ make -y"
//                     sh "npm install --legacy-peer-deps"
//                     echo "Build main site distribution"
//                     sh "CI=false npm run build"
//                     slackSend (channel: '#jenkins-alert', color: '#FFFF00', message: "Frontend Build Complete: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
//               }

//     }

//     stage('Deploy') {
//         echo "Deploy Start"
//         sshagent(credentials: ['kic_key']) {
//                     echo "sshagent start"
//                     sh "ssh -o StrictHostKeyChecking=no centos@210.109.60.60 -p 10001 uptime"
//                     sh "scp -r -P 10001 /var/jenkins_home/workspace/forCloud_Frontend_Pipeline/build centos@210.109.60.60:/home/centos/Frontend"
//                     echo "here"
//                     sh "ssh -T centos@210.109.60.60 -p 10001 'cd /home/centos/Frontend'"
//                     echo "here"
//                     sh "ssh -T centos@210.109.60.60 -p 10001 'npm start'"
                   
//                     slackSend (channel: '#jenkins-alert', color: '#FFFF00', message: "WEB-1-Frontend Deploy Complete: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
//                     echo "Web_1_Success"
//                     // sh ''' 
//                     //     ssh -o StrictHostKeyChecking=no centos@210.109.60.60 -p 10002 uptime
//                     //     ssh -T centos@210.109.60.60 -p 10002 ./please.sh
//                     //     scp -r -P 10002 /var/jenkins_home/workspace/forCloud_Frontend_Pipeline/build centos@210.109.60.60:/home/centos/Frontend
//                     //     ssh -T centos@210.109.60.60 -p 10002 ./deploy.sh
//                     // '''
//                     // slackSend (channel: '#jenkins-alert', color: '#FFFF00', message: "WEB-2-Frontend Deploy Complete: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
//                     // echo "Web_2_Success"
//         }
//     }

// }

