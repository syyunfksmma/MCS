-- Sprint12 Optimized Data Path monitoring
SELECT TOP 50
    qs.last_execution_time,
    DB_NAME(st.dbid) AS DatabaseName,
    qs.total_elapsed_time/qs.execution_count AS AvgElapsed,
    qs.total_worker_time/qs.execution_count AS AvgCPU,
    qs.total_logical_reads/qs.execution_count AS AvgReads,
    st.text
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) st
ORDER BY qs.last_execution_time DESC;

SELECT
    OBJECT_NAME(object_id) AS TableName,
    row_count,
    data_compression_desc
FROM sys.dm_db_column_store_row_group_physical_stats
WHERE state_desc = 'COMPRESSED';
