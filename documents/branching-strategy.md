There are three (3) branches for this repository.
* Dev
* Staging
* Master

Participants work in the Dev branch and create separate feature-branches in this repository. When the feature is complete, the feature-branch is merged into the Dev branch and then pushed to Staging with testing.

The stability of the branches should always be Dev < Staging < Master<br/>
The features of the branches would always be Master < Staging < Dev


## Branches Overview

| Branch  | Protected?  | Base Branch      | Description    |
| :-------|:------------|:-----------------|:---------------|
| `master`| YES         | N/A              | What is live in production (**stable**).<br/>A pull request is required to merge code into `master`. |
| `staging` | NO          | `master`         | Completed cutting-edge features (**stable**).|
| `dev` | NO       | `staging`         | Active development (**unstable**).<br/> |
