export class API {
  static coverage(params) {
    return $.get(Routes.api_coverage_index_path(params));
  }

  static groupedCoverage(params) {
    return $.get('http://dev.seeg-mapbiomas.terras.agr.br/colecao2/dashboard/services/statistics/groupedcover', params);
  }

  static qualities(params) {
    return $.get(Routes.api_qualities_path(params));
  }

  static territories(params) {
    return $.get(Routes.api_territories_path(params));
  }

  static transitions(params) {
    return $.get(Routes.api_transitions_path(params));
  }

  static createMap(params) {
    return $.ajax({
      url: Routes.create_map_path(),
      data: JSON.stringify({ map: params }),
      method: 'POST',
      dataType: 'JSON',
      contentType: 'application/json; charset=utf-8'
    });
  }

  static updateMap(id, params) {
    return $.ajax({
      url: Routes.update_map_path(id),
      data: JSON.stringify({ map: params }),
      method: 'PATCH',
      dataType: 'JSON',
      contentType: 'application/json; charset=utf-8'
    });
  }
}
