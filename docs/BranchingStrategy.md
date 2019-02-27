# Branching Strategy and Environments

There are three (3) 'special' branches in this repository, each associated with a deployment environment.

| Branch    | Environment  | Base Branch      | Description    |
|:----------|:-------------|:-----------------|:---------------|
| `master`  | Production   | N/A              | What is live in production (**stable**). |
| `staging` | Stage/UAT    | `master`         | Completed cutting-edge features (**stable**).|
| `dev`     | Development  | `staging`        | Active development (**unstable**).<br/> |

The intended flow is for developers to create personal feature branches off of the `dev` branch, and when the feature is ready for submission they should create a PR back to `dev`. Travis CI will automatically deploy the change to the development environment after the PR is approved and closed, at which point the change can undergo additional testing and verification. When the change is verified as stable, it can be merged to `staging` via a PR from `dev`. Once the PR is approve and closed, Travis will trigger a deployment to the stage environment for user acceptance testing. Finally, when the code in stage is determined to be production-ready, it should be merged into `master` via a PR from `staging`. Travis CI will automate the deployment to production upon acceptance of the PR.

The stability of the branches should always be `dev` < `staging` < `master`

The features of the branches would always be `master` < `staging` < `dev`
