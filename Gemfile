#after any changes to the Gemfile, execute bundle update!
source "https://rubygems.org"
gemspec

# 固定 sass-embedded 版本以确保构建成功（使用更稳定的版本）
# 明确指定版本范围，避免自动升级到有问题的版本
gem 'sass-embedded', '~> 1.91.0', '< 1.93'

# Delete the following lines if not on Windows: 
# Performance-booster for watching directories on Windows
gem "wdm", ">= 0.1.0" if Gem.win_platform?
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
