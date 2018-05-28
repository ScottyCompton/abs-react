#!/usr/bin/env bash

echo "Configuring Staging Profile: amer-bstar-staging"
aws configure set --profile amer-bstar-staging aws_access_key_id AKIAJ34WXA52EJB3KZTA 
aws configure set --profile amer-bstar-staging aws_secret_access_key 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
aws configure set --profile amer-bstar-staging region us-west-2
aws configure set --profile amer-bstar-staging output text

echo "Configuring Production Profile: amer-bstar-prod"
aws configure set --profile amer-bstar-prod  aws_access_key_id AKIAJXRYBUGIZOLTJLEA
aws configure set --profile amer-bstar-prod  aws_secret_access_key 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
aws configure set --profile amer-bstar-prod  region us-west-2
aws configure set --profile amer-bstar-prod  output text

echo "Configuration Complete...."
