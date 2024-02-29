git filter-branch -f --env-filter \
    'if [ $GIT_COMMIT = 874f9fd572445ad9f175af4adf845dedaf47834a ]
     then
         export GIT_AUTHOR_DATE="Thu Feb 29 23:21:25 2024"
         export GIT_COMMITTER_DATE="Thu Feb 23:21:25 2024"
     fi'