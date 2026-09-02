require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-rn-kore-bot-sdk"
  s.version      = package["version"]
  s.summary      = package["description"] || "Kore.ai React Native Bot SDK"
  s.description  = package["description"] || s.summary
  
  # Use homepage if available, otherwise fall back to the repository URL.
  # `repository` is optional in package.json and may be either a hash or a URL.
  repository = package["repository"]
  repository_url = repository.is_a?(Hash) ? repository["url"] : repository
  s.homepage     = package["homepage"] || repository_url || "https://github.com/Koredotcom/react-native-botsdk"
  
  s.license      = package["license"] || { :type => "MIT" }
  s.authors      = package["author"] || { "Kore.ai" => "https://kore.ai" }

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/Koredotcom/react-native-botsdk.git", :tag => "#{s.version}" }

  # The ios/ directory contains the SampleUI application's AppDelegate and
  # resources, not native SDK implementation files. Do not compile the sample
  # application's Swift entry point as part of this React Native pod.
  s.source_files = []
  s.requires_arc = true

  s.dependency "React-Core"

  # Don't install the dependencies when we run `pod install` in the old architecture.
  if ENV['RCT_NEW_ARCH_ENABLED'] == '1' then
    s.compiler_flags = "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -DRCT_NEW_ARCH_ENABLED=1"
    s.pod_target_xcconfig = {
      "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
      "OTHER_CPLUSPLUSFLAGS" => "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1",
      "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
    }
    s.dependency "React-Codegen"
    s.dependency "RCT-Folly"
    s.dependency "RCTRequired"
    s.dependency "RCTTypeSafety"
    s.dependency "ReactCommon/turbomodule/core"
  end
end
