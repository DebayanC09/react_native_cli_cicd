pipeline {
    agent any

    environment {
        ANDROID_HOME = '/Users/debayanchowdhury/Library/Android/sdk'
        PATH = "${env.PATH}:${env.ANDROID_HOME}/platform-tools:${env.ANDROID_HOME}/tools"
        FIREBASE_APP_ID = credentials('firebase-app-id')
        FIREBASE_CREDENTIALS = credentials('firebase-credentials')
        FIREBASE_SERVICE_ACCOUNT = credentials('firebase-service-account')
        ENV_DEVELOPMENT = credentials('env-development')
        ENV_UAT = credentials('env-uat')
        ENV_PRODUCTION = credentials('env-production')
    }

    tools {
        nodejs('20.14.0')
        jdk('17')
    }

    parameters {
        choice(name: 'BUILD_ENV', choices: ['development', 'uat', 'production'], description: 'Choose the environment to build')
    }

    stages {
        stage('Clone Project') {
            steps {
                git branch: 'main', url: 'https://github.com/DebayanC09/react_native_cli_cicd.git'
            }
        }

        stage('Set Firebase Credentials') {
            steps {
                sh '''
                echo $FIREBASE_CREDENTIALS | base64 --decode > android/app/google-services.json
                echo $FIREBASE_SERVICE_ACCOUNT | base64 --decode > firebase-service-account.json
                echo "GOOGLE_APPLICATION_CREDENTIALS=$WORKSPACE/firebase-service-account.json" >> $WORKSPACE/.env
                '''
            }
        }

        stage('Set Environment Variables') {
            steps {
                script {
                    switch (params.BUILD_ENV) {
                        case 'development':
                            sh 'echo $ENV_DEVELOPMENT | base64 --decode > .env.development'
                            break
                        case 'uat':
                            sh 'echo $ENV_UAT | base64 --decode > .env.uat'
                            break
                        case 'production':
                            sh 'echo $ENV_PRODUCTION | base64 --decode > .env.production'
                            break
                        default:
                            error "Invalid environment selected!"
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build APK') {
            steps {
                script {
                    switch (params.BUILD_ENV) {
                        case 'development':
                            sh 'npm run android:apk:development'
                            env.APK_PATH = 'android/app/build/outputs/apk/development/release/app-development-release.apk'
                            break
                        case 'uat':
                            sh 'npm run android:apk:uat'
                            env.APK_PATH = 'android/app/build/outputs/apk/uat/release/app-uat-release.apk'
                            break
                        case 'production':
                            sh 'npm run android:apk:production'
                            env.APK_PATH = 'android/app/build/outputs/apk/production/release/app-production-release.apk'
                            break
                        default:
                            error "Invalid environment selected!"
                    }
                }
            }
        }

        stage('Upload APK to Firebase App Distribution') {
            steps {
                sh """
                npx firebase-tools appdistribution:distribute \
                $APK_PATH \
                --app $FIREBASE_APP_ID \
                --groups testers \
                --release-notes "New ${params.BUILD_ENV} release update"
                """
            }
        }
    }

    post {
        success {
            echo '✅ Build and upload succeeded!'
        }
        failure {
            echo '❌ Build or upload failed!'
        }
    }
}