require(['vendor/domReady!', 'load/init-page'], function (doc, page) {
    'use strict';

    require(['d3', 'underscore', 'views/data-table-view', 'views/stacked-bar-view'],
        function (d3, _, DataTableView, StackedBarView) {
            var model = page.models.courseModel,
                graphSubmissionColumns = [
                    {
                        key: 'correct_submissions',
                        percent_key: 'correct_percent',
                        title: gettext('Correct'),
                        className: 'text-right',
                        type: 'number',
                        color: '#4BB4FB'
                    },
                    {
                        key: 'incorrect_submissions',
                        percent_key: 'incorrect_percent',
                        title: gettext('Incorrect'),
                        className: 'text-right',
                        type: 'number',
                        color: '#CA0061'
                    }
                ],
                tableColumns = [
                    {key: 'index', title: gettext('Sequence'), type: 'number', className: 'text-right'},
                    {key: 'name', title: gettext('Problem Name'), type: 'hasNull'}
                ].concat(graphSubmissionColumns);

            tableColumns.push({
                key: 'total_submissions',
                title: gettext('Total'),
                className: 'text-right',
                type: 'number',
                color: '#4BB4FB'
            });

            new StackedBarView({
                el: '#chart-view',
                model: model,
                modelAttribute: 'problems',
                truncateXTicks: true,
                trends: graphSubmissionColumns,
                x: {key: 'id', displayKey: 'name'},
                y: {key: 'count'},
                interactiveTooltipValueTemplate: function(trend) {
                    /* Translators: <%=value%> will be replaced by a number followed by a percentage.
                     For example, "400 (29%)" */
                    return _.template(gettext('<%=value%> (<%=percent%>)'))({
                        value: trend.value,
                        percent: d3.format('.1%')(trend.point[trend.options.percent_key])
                    });
                },
                click: function (d) { if (_(d).has('url')) { document.location.href = d.url; }}
            });

            new DataTableView({
                el: '[data-role=problem-table]',
                model: model,
                modelAttribute: 'problems',
                columns: tableColumns,
                sorting: ['index']
            });
        });
});
