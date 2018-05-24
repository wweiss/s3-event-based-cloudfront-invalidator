require('dotenv').config();

const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const install = require('gulp-install');
const run = require('gulp-run-command').default;

const vars = {
  s3BucketName: process.env.S3_BUCKET_NAME,
  cloudFormationStackName: process.env.STACK_NAME
};

const paths = {
  src: 'src',
  dist: 'dist',
  tmp: 'tmp'
};

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

const clean = () => {
  return del([paths.dist, paths.tmp]);
}
exports.clean = clean;

const packageInit = () => {
  return gulp.src('*.*', {
      read: false
    })
    .pipe(gulp.dest(paths.tmp));
}
exports.packageInit = packageInit;

const packageNpm = () => {
  return gulp.src('package.json')
    .pipe(gulp.dest(paths.dist))
    .pipe(
      install({
        production: true
      })
    );
}
exports.packageNpm = packageNpm;

const cleanNpm = () => {
  return del(`${paths.dist}/package*.json`)
};
exports.cleanNpm = cleanNpm;

const packageTranspile = () => {
  const tsResult = tsProject.src().pipe(tsProject());
  return tsResult.js.pipe(gulp.dest(paths.dist));
};
exports.packageTranspile = packageTranspile;

const packageCloudFormation = () => {
  return run(`aws cloudformation package \
--template app.template.yaml \
--s3-bucket ${vars.s3BucketName} \
--output-template ${paths.tmp}/packaged-sam.yaml`)();
}
exports.packageCloudFormation = packageCloudFormation;

const package = gulp.series(clean, gulp.parallel(packageInit, packageNpm, packageTranspile), cleanNpm, packageCloudFormation);
exports.package = package;

const deployCloudFormation = () => {
  return run(`aws cloudformation deploy \
--template-file ${paths.tmp}/packaged-sam.yaml \
--stack-name ${vars.cloudFormationStackName} \
--capabilities CAPABILITY_IAM`)();
}
exports.deployCloudFormation = deployCloudFormation;

const deploy = gulp.series(package, deployCloudFormation);
exports.deploy = deploy;