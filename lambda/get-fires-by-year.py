import json
import boto3
import time

athena = boto3.client('athena')

DATABASE = "wildfire_db4"
OUTPUT = "s3://wildfire-data2/query_output/"

def lambda_handler(event, context):
    # Example: query fires grouped by year
    query = """
        SELECT fireyear, COUNT(*) as total_fires
        FROM firedata
        WHERE fireyear > 1973 AND fireyear<2024
        GROUP BY fireyear
        ORDER BY fireyear DESC;
    """

    response = athena.start_query_execution(
        QueryString=query,
        QueryExecutionContext={'Database': DATABASE},
        ResultConfiguration={'OutputLocation': OUTPUT}
    )

    query_execution_id = response['QueryExecutionId']

    # Wait for the query to finish
    while True:
        status = athena.get_query_execution(QueryExecutionId=query_execution_id)
        state = status['QueryExecution']['Status']['State']
        if state in ['SUCCEEDED', 'FAILED', 'CANCELLED']:
            break
        time.sleep(1)

    if state != 'SUCCEEDED':
        return {"statusCode": 500, "body": json.dumps("Query failed")}

    # Get results
    result = athena.get_query_results(QueryExecutionId=query_execution_id)

    # Format results as JSON
    rows = result['ResultSet']['Rows']
    headers = [col['VarCharValue'] for col in rows[0]['Data']]
    data = []
    for row in rows[1:]:
        item = {}
        for i, col in enumerate(row['Data']):
            item[headers[i]] = col.get('VarCharValue', None)
        data.append(item)

    return {
        "statusCode": 200,
        "body": json.dumps(data)
    }
