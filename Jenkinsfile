pipeline {
    agent any

    environment {
        NODE_VERSION = '20.14.0'
        JAVA_VERSION = '17'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/your-repo.git'
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