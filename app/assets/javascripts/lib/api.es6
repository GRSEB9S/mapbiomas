class API {
  static coverage(params) {
    return $.get(Routes.api_coverage_index_path(params));
  }

  static transitions(params) {
    return $.get(Routes.api_transitions_path(params));
  }
}
