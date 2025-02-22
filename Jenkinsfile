pipeline {
    agent any

    environment {
        NODE_VERSION = '20.14.0'
        JAVA_VERSION = '17'
        FIREBASE_APP_ID = credentials('FIREBASE_APP_ID')    // Add this in Jenkins credentials
        FIREBASE_CREDENTIALS = credentials('FIREBASE_CREDENTIALS')
        FIREBASE_SERVICE_ACCOUNT = credentials('FIREBASE_SERVICE_ACCOUNT')
        ANDROID_HOME = "${env.HOME}/Android/Sdk"
        PATH = "${env.PATH}:${ANDROID_HOME}/tools:${ANDROID_HOME}/platform-tools"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/your-repo.git'
            }
        }

        stage('Set Node and Java Version') {
            steps {
                sh 'nvm install $NODE_VERSION && nvm use $NODE_VERSION'
                sh 'export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))'
                sh 'echo "Node Version: $(node -v)"'
                sh 'echo "Java Version: $(java -version)"'
            }
        }

        stage('Decode Google Services JSON') {
            steps {
                sh '''
                echo "$FIREBASE_CREDENTIALS" | base64 --decode > android/app/google-services.json
                echo "$FIREBASE_SERVICE_ACCOUNT" | base64 --decode > firebase-service-account.json
                echo "GOOGLE_APPLICATION_CREDENTIALS=$WORKSPACE/firebase-service-account.json" >> $WORKSPACE/.env
                '''
            }
        }

        stage('Grant Execute Permission for Gradle') {
            steps {
                sh 'chmod +x ./android/gradlew'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Android APK') {
            steps {
                sh 'cd android && ./gradlew assembleRelease'
            }
        }

        stage('Upload APK to Firebase App Distribution') {
            steps {
                sh '''
                npx firebase-tools appdistribution:distribute \
                android/app/build/outputs/apk/release/app-release.apk \
                --app $FIREBASE_APP_ID \
                --groups testers \
                --release-notes "New release update"
                '''
            }
        }
    }

    post {
        success {
            echo 'Build and upload succeeded!'
        }
        failure {
            echo 'Build or upload failed!'
        }
    }
}