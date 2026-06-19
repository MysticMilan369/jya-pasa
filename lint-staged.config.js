module.exports = {
  // 1. Lint and format your actual NestJS application code safely inside src
  'src/**/*.{js,ts}': ['eslint --fix', 'prettier --write'],

  // 2. Format your configuration, documentation, and metadata files automatically
  '**/*.{json,md,yaml,yml}': ['prettier --write'],
};
