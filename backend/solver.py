import pandas as pd
#read file
data = pd.read_csv('kenyan_car_dataset.csv')

# sort for each column into a list of the col name for all different data and append to the column name dict
def sort_for_each_column(data):
    col_name_dict = {}
    for col in data.columns:
        if col != 'Mileage (km)' and col != 'Resale Value (Ksh)':
            col_name_dict[col] = data[col].unique().tolist()
    return col_name_dict


# print all the dict
def print_all_dict(col_name_dict):
    for key, value in col_name_dict.items():
        print(key, ' : ', value)
        

if __name__ == '__main__':
    col_name_dict = sort_for_each_column(data)
    print_all_dict(col_name_dict)
    print('done')

